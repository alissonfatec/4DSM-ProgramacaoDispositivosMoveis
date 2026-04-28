import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { alunosService } from "../services";
import { colors, spacing, radius } from "../styles/theme";
import { useFetch } from "../hooks/useFetch";

export default function AlunosListScreen({ navigation }) {
  const {
    data: alunos,
    loading,
    error,
    execute,
  } = useFetch(() => alunosService.listar());

  useFocusEffect(
    useCallback(() => {
      execute();
    }, []),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.erro}>{error}</Text>
        <TouchableOpacity style={styles.botao} onPress={execute}>
          <Text style={styles.botaoTexto}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={alunos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum aluno cadastrado</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.matricula}>{item.matricula}</Text>
            </View>
            <Text style={styles.info}>{item.curso}</Text>
            <Text style={styles.info}>{item.email}</Text>
            {item.cidade && item.estado && (
              <Text style={styles.info}>
                {item.cidade} — {item.estado}
              </Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CadastroAlunos")}
      >
        <Text style={styles.fabTexto}>+ Novo Aluno</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  lista: { padding: spacing.lg, paddingBottom: 100 },
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
    marginBottom: 6,
  },
  nome: { fontSize: 15, fontWeight: "600", color: colors.textPrimary, flex: 1 },
  matricula: { fontSize: 12, color: colors.primary, fontWeight: "600" },
  info: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  vazio: { textAlign: "center", color: colors.textMuted, marginTop: 40 },
  erro: { color: colors.danger, marginBottom: 12 },
  botao: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  botaoTexto: { color: "#fff", fontWeight: "600" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    left: 24,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 4,
  },
  fabTexto: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
