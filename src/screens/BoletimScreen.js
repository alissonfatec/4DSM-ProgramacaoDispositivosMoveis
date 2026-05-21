import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { boletimService } from "../services"; // Se tiver notasService, adicione aqui!
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

// 1. O Componente do Card (agora recebe a função onEditar)
function CardNota({ item, usuario, onEditar }) {
  const aprovado = item.situacao === "Aprovado";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardDisciplina}>{item.disciplina}</Text>
          <Text style={styles.cardProfessor}>
            Prof. {item.professor || "—"}
          </Text>
        </View>

        {/* Botão de Editar aciona a função que abre o Modal! */}
        {(usuario?.perfil === "professor" || usuario?.perfil === "admin") && (
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => onEditar(item)}
          >
            <Text style={styles.textoEditar}>✏️ Lançar Nota</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardNotas}>
        <View style={styles.notaItem}>
          <Text style={styles.notaLabel}>Nota 1</Text>
          <Text style={styles.notaValor}>
            {item.nota1 !== null ? item.nota1 : "-"}
          </Text>
        </View>
        <View style={styles.notaItem}>
          <Text style={styles.notaLabel}>Nota 2</Text>
          <Text style={styles.notaValor}>
            {item.nota2 !== null ? item.nota2 : "-"}
          </Text>
        </View>
        <View style={styles.notaItem}>
          <Text style={styles.notaLabel}>Média</Text>
          <Text style={[styles.notaValor, styles.mediaValor]}>
            {item.media !== null ? item.media : "-"}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            aprovado ? styles.badgeAprovado : styles.badgeReprovado,
          ]}
        >
          <Text style={styles.badgeTexto}>{item.situacao}</Text>
        </View>
      </View>
    </View>
  );
}

export default function BoletimScreen({ route, navigation }) {
  const { usuario } = useAuth();
  const [matricula, setMatricula] = useState("");
  const [boletim, setBoletim] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados do Modal de Notas
  const [modalVisivel, setModalVisivel] = useState(false);
  const [notaAtual, setNotaAtual] = useState(null); // Guarda a disciplina clicada
  const [novaNota1, setNovaNota1] = useState("");
  const [novaNota2, setNovaNota2] = useState("");
  const [salvandoNota, setSalvandoNota] = useState(false);

  const matriculaVindaDoDashboard = route?.params?.matriculaEstudante;

  useEffect(() => {
    if (
      usuario?.perfil === "aluno" &&
      matriculaVindaDoDashboard &&
      matriculaVindaDoDashboard !== "Não localizada"
    ) {
      setMatricula(String(matriculaVindaDoDashboard));
    }
  }, [matriculaVindaDoDashboard, usuario]);

  async function handleBuscar() {
    if (!matricula.trim()) {
      Alert.alert("Atenção", "Informe a matrícula");
      return;
    }
    setLoading(true);
    setBoletim(null);
    try {
      const response = await boletimService.consultar(matricula.trim());
      setBoletim(response.data);
    } catch (err) {
      const mensagem = err.response?.data?.error || "Erro ao buscar boletim";
      Alert.alert("Erro", mensagem);
    } finally {
      setLoading(false);
    }
  }

  // Abre a janelinha já com as notas atuais preenchidas
  function abrirModalEdicao(itemDisciplina) {
    setNotaAtual(itemDisciplina);
    setNovaNota1(
      itemDisciplina.nota1 != null ? String(itemDisciplina.nota1) : "",
    );
    setNovaNota2(
      itemDisciplina.nota2 != null ? String(itemDisciplina.nota2) : "",
    );
    setModalVisivel(true);
  }

  async function handleSalvarNotas() {
    setSalvandoNota(true);
    try {
      const n1 = parseFloat(String(novaNota1).replace(",", "."));
      const n2 = parseFloat(String(novaNota2).replace(",", "."));

      if (isNaN(n1) || isNaN(n2)) {
        Alert.alert("Atenção", "Por favor, digite valores numéricos válidos.");
        setSalvandoNota(false);
        return;
      }

      const notaId = notaAtual.nota_id || notaAtual.id;

      if (notaId) {
        await api.put(`/notas/${notaId}`, {
          nota1: n1,
          nota2: n2,
        });
      } else {
        await api.post("/notas", {
          aluno_id: boletim.aluno_id || boletim.id, // Pega o ID do aluno que está no boletim
          disciplina_id: notaAtual.disciplina_id, // Pega o ID da disciplina clicada
          nota1: n1,
          nota2: n2,
        });
      }

      setModalVisivel(false);
      await handleBuscar();

      Alert.alert("Sucesso!", "Notas salvas com sucesso.");
      setModalVisivel(false);

      handleBuscar();
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      const msgErro =
        error.response?.data?.error ||
        "Não foi possível salvar as notas no banco.";
      Alert.alert("Erro", msgErro);
    } finally {
      setSalvandoNota(false);
    }
  }

  const podeDigitarMatricula = usuario?.perfil !== "aluno";

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Consulta de Boletim</Text>

      {usuario?.perfil === "aluno" && (
        <View style={styles.alertaMatricula}>
          <Text style={styles.alertaTexto}>
            📌 Sua Matrícula: {matriculaVindaDoDashboard || "Não localizada"}
          </Text>
        </View>
      )}

      <View style={styles.busca}>
        <TextInput
          style={[
            styles.input,
            !podeDigitarMatricula && styles.inputDesabilitado,
          ]}
          placeholder="Matrícula do aluno"
          value={matricula}
          onChangeText={setMatricula}
          keyboardType="default"
          autoCapitalize="none"
          editable={podeDigitarMatricula}
        />
        <TouchableOpacity
          style={styles.botaoBusca}
          onPress={handleBuscar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.botaoTexto}>Buscar</Text>
          )}
        </TouchableOpacity>
      </View>

      {boletim && (
        <>
          <View style={styles.infoAluno}>
            <Text style={styles.nomeAluno}>{boletim.aluno}</Text>
            <Text style={styles.infoTexto}>
              {boletim.curso} · {boletim.matricula}
            </Text>
          </View>

          <FlatList
            data={boletim.disciplinas}
            keyExtractor={(_, i) => String(i)}
            // Passa a função para o card abrir o Modal
            renderItem={({ item }) => (
              <CardNota
                item={item}
                usuario={usuario}
                onEditar={abrirModalEdicao}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.vazio}>Nenhuma nota cadastrada</Text>
            }
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </>
      )}

      {/* MODAL DE EDIÇÃO DE NOTAS FLUTUANTE */}
      <Modal visible={modalVisivel} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Lançar Notas</Text>
            <Text style={styles.modalSubtitulo}>{notaAtual?.disciplina}</Text>

            <View style={styles.modalRow}>
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Nota 1:</Text>
                <TextInput
                  style={styles.modalInput}
                  value={novaNota1}
                  onChangeText={setNovaNota1}
                  keyboardType="numeric"
                  placeholder="Ex: 8.5"
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Nota 2:</Text>
                <TextInput
                  style={styles.modalInput}
                  value={novaNota2}
                  onChangeText={setNovaNota2}
                  keyboardType="numeric"
                  placeholder="Ex: 7.0"
                />
              </View>
            </View>

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() => setModalVisivel(false)}
                disabled={salvandoNota}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoSalvar}
                onPress={handleSalvarNotas}
                disabled={salvandoNota}
              >
                {salvandoNota ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.textoSalvar}>Salvar Notas</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// OS ESTILOS COMPLETOS!
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1a1a2e",
  },
  alertaMatricula: {
    backgroundColor: "#EBF3FC",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D0E3F9",
  },
  alertaTexto: { color: "#1A569B", fontSize: 14, fontWeight: "600" },
  busca: { flexDirection: "row", marginBottom: 20, gap: 8 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  inputDesabilitado: { backgroundColor: "#e9ecef", color: "#6c757d" },
  botaoBusca: {
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 70,
  },
  botaoTexto: { color: "#fff", fontWeight: "bold" },
  infoAluno: {
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  nomeAluno: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  infoTexto: { color: "#aaa", fontSize: 13, marginTop: 4 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cardDisciplina: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 2,
  },
  cardProfessor: { fontSize: 12, color: "#888" },
  botaoEditar: {
    backgroundColor: "#EAF3DE",
    borderWidth: 1,
    borderColor: "#C3E0A1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  textoEditar: { fontSize: 12, color: "#4B7B12", fontWeight: "bold" },

  cardNotas: { flexDirection: "row", alignItems: "center", gap: 12 },
  notaItem: { alignItems: "center" },
  notaLabel: { fontSize: 11, color: "#999" },
  notaValor: { fontSize: 15, fontWeight: "600", color: "#333" },
  mediaValor: { color: "#1a1a2e", fontSize: 17 },
  badge: {
    marginLeft: "auto",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeAprovado: { backgroundColor: "#d4edda" },
  badgeReprovado: { backgroundColor: "#f8d7da" },
  badgeTexto: { fontSize: 12, fontWeight: "bold", color: "#333" },
  vazio: { textAlign: "center", color: "#999", marginTop: 40 },

  // --- ESTILOS DO MODAL ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 12,
    padding: 24,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  modalSubtitulo: { fontSize: 14, color: "#666", marginBottom: 20 },
  modalRow: { flexDirection: "row", gap: 16, marginBottom: 24 },
  modalInputGroup: { flex: 1 },
  modalLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
    textAlign: "center",
  },
  modalBotoes: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  botaoCancelar: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textoCancelar: { color: "#666", fontWeight: "bold", fontSize: 15 },
  botaoSalvar: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  textoSalvar: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
