import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";
import { colors, spacing, radius } from "../styles/theme";

export default function DisciplinasProfessorScreen({ navigation }) {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useFocusEffect recarrega a tela sempre que o professor voltar para ela
  useFocusEffect(
    useCallback(() => {
      carregarDisciplinas();
    }, [])
  );

  const carregarDisciplinas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/disciplinas/minhas");
      setDisciplinas(response.data);
    } catch (err) {
      console.error("Erro ao carregar disciplinas:", err);
      setError("Não foi possível carregar suas turmas.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={styles.center}>
          <Text style={styles.erro}>{error}</Text>
          <TouchableOpacity style={styles.botao} onPress={carregarDisciplinas}>
            <Text style={styles.botaoTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <FlatList
          data={disciplinas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhuma turma atribuída a você.</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("AlunosDisciplina", { disciplina: item })}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.badge}>{item.semestre}</Text>
              </View>
              <View style={styles.rodape}>
                {item.curso && <Text style={styles.tag}>📘 {item.curso}</Text>}
                <Text style={styles.tag}>⏱ {item.carga_horaria}h</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  nome: { fontSize: 15, fontWeight: "600", color: colors.textPrimary, flex: 1 },
  badge: {
    fontSize: 11,
    color: colors.warning,
    fontWeight: "600",
    backgroundColor: "#FAEEDA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginLeft: 8,
  },
  rodape: { flexDirection: "row", gap: 12, marginTop: 8 },
  tag: { fontSize: 12, color: colors.textMuted },
  vazio: { textAlign: "center", color: colors.textMuted, marginTop: 40 },
  erro: { color: colors.danger, marginBottom: 12 },
  botao: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  botaoTexto: { color: "#fff", fontWeight: "600" },
});