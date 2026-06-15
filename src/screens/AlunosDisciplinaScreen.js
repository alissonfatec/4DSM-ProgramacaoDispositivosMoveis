import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../services/api";
import { colors, spacing, radius } from "../styles/theme";

export default function AlunosDisciplinaScreen({ route }) {
  const { disciplina } = route.params;
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notasEditadas, setNotasEditadas] = useState({});

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/disciplinas/${disciplina.id}/alunos`);
      setAlunos(response.data);
      
      // Inicializa o estado dos inputs com as notas vindas do banco
      const notasIniciais = {};
      response.data.forEach(aluno => {
        notasIniciais[aluno.aluno_id] = {
          nota1: aluno.nota1 != null ? String(aluno.nota1) : "",
          nota2: aluno.nota2 != null ? String(aluno.nota2) : ""
        };
      });
      setNotasEditadas(notasIniciais);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      Alert.alert("Erro", "Não foi possível carregar o diário de classe.");
    } finally {
      setLoading(false);
    }
  };

  const handleNotaChange = (alunoId, campo, valor) => {
    const valorFormatado = valor.replace(",", "."); // Troca vírgula por ponto
    setNotasEditadas(prev => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        [campo]: valorFormatado
      }
    }));
  };

  const salvarNota = async (alunoId) => {
    const { nota1, nota2 } = notasEditadas[alunoId];
    
    if (nota1 === "" || nota2 === "") {
      Alert.alert("Atenção", "Preencha a N1 e a N2 antes de salvar.");
      return;
    }

    try {
      await api.post("/notas", {
        aluno_id: alunoId,
        disciplina_id: disciplina.id,
        nota1: parseFloat(nota1),
        nota2: parseFloat(nota2)
      });
      
      Alert.alert("Sucesso", "Nota lançada com sucesso!");
      carregarAlunos(); // Recarrega a lista para atualizar média e situação
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      Alert.alert("Erro", "Não foi possível salvar a nota.");
    }
  };

  const renderAluno = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.matricula}>{item.matricula}</Text>
      </View>
      
      <View style={styles.notasRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>N1:</Text>
          <TextInput 
            style={styles.input}
            keyboardType="numeric"
            value={notasEditadas[item.aluno_id]?.nota1}
            onChangeText={(val) => handleNotaChange(item.aluno_id, "nota1", val)}
            maxLength={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>N2:</Text>
          <TextInput 
            style={styles.input}
            keyboardType="numeric"
            value={notasEditadas[item.aluno_id]?.nota2}
            onChangeText={(val) => handleNotaChange(item.aluno_id, "nota2", val)}
            maxLength={4}
          />
        </View>

        <TouchableOpacity 
          style={styles.botaoSalvar} 
          onPress={() => salvarNota(item.aluno_id)}
        >
          <Text style={styles.botaoTextoSalvar}>Salvar</Text>
        </TouchableOpacity>
      </View>

      {/* Só mostra a linha de média se já houver notas validadas no banco */}
      {item.media != null && (
         <View style={styles.resultadoContainer}>
           <Text style={styles.mediaTexto}>Média: {item.media}</Text>
           <Text style={[
             styles.situacaoTexto, 
             { color: item.situacao === "Aprovado" ? "#28a745" : colors.danger }
           ]}>
             {item.situacao}
           </Text>
         </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>{disciplina.nome}</Text>
        
        {loading ? (
           <View style={styles.center}>
             <ActivityIndicator size="large" color={colors.primary} />
           </View>
        ) : (
          <FlatList
            data={alunos}
            keyExtractor={(item) => String(item.aluno_id)}
            contentContainerStyle={styles.lista}
            ListEmptyComponent={
              <Text style={styles.vazio}>Nenhum aluno matriculado nesta matéria.</Text>
            }
            renderItem={renderAluno}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: colors.primary, 
    textAlign: "center", 
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.border
  },
  lista: { padding: spacing.lg, paddingBottom: 40 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: colors.border,
    elevation: 1,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  nome: { fontSize: 15, fontWeight: "600", color: colors.textPrimary, flex: 1 },
  matricula: { fontSize: 13, color: colors.textSecondary, fontWeight: "600" },
  notasRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between" 
  },
  inputGroup: { flexDirection: "row", alignItems: "center", gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: colors.textSecondary },
  input: { 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: radius.sm, 
    width: 55, 
    height: 38, 
    textAlign: "center", 
    fontSize: 14, 
    color: colors.textPrimary,
    backgroundColor: colors.background
  },
  botaoSalvar: { 
    backgroundColor: colors.primary, 
    borderRadius: radius.md, 
    paddingHorizontal: 16, 
    paddingVertical: 10,
    justifyContent: "center"
  },
  botaoTextoSalvar: { color: "#fff", fontWeight: "600", fontSize: 13 },
  resultadoContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 14, 
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderColor: colors.border 
  },
  mediaTexto: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  situacaoTexto: { fontSize: 14, fontWeight: "700" }
});