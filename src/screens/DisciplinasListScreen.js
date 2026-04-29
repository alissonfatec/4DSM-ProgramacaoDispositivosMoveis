import React, { useCallback } from "react";
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
import { disciplinasService } from "../services";
import { colors, spacing, radius } from "../styles/theme";
import { useFetch } from "../hooks/useFetch";

export default function DisciplinasListScreen({ navigation }) {
  const {
    data: disciplinas,
    loading,
    error,
    execute,
  } = useFetch(() => disciplinasService.listar());

  useFocusEffect(
    useCallback(() => {
      execute();
    }, []),
  );

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
          <TouchableOpacity style={styles.botao} onPress={execute}>
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
            <Text style={styles.vazio}>Nenhuma disciplina cadastrada</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.badge}>{item.semestre}</Text>
              </View>
              {item.professor_nome && (
                <Text style={styles.info}>🎓 {item.professor_nome}</Text>
              )}
              <View style={styles.rodape}>
                {item.curso && <Text style={styles.tag}>📘 {item.curso}</Text>}
                <Text style={styles.tag}>⏱ {item.carga_horaria}h</Text>
              </View>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("CadastroDisciplinas")}
        >
          <Text style={styles.fabTexto}>+ Nova Disciplina</Text>
        </TouchableOpacity>
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
  },
  info: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
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
  fab: {
    position: "absolute",
    bottom: 16,
    right: 24,
    left: 24,
    backgroundColor: colors.warning,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 4,
  },
  fabTexto: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
