import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../hooks/useAuth";
import { colors, spacing, radius } from "../styles/theme";
import {
  alunosService,
  professoresService,
  disciplinasService,
} from "../services";

const NAV_ITEMS = [
  {
    id: "alunos",
    label: "Alunos",
    sub: "Cadastrar aluno",
    icon: "👤",
    color: colors.primaryLight,
    iconColor: colors.primary,
    screen: "CadastroAlunos",
  },
  {
    id: "professores",
    label: "Professores",
    sub: "Cadastrar professor",
    icon: "🎓",
    color: "#EAF3DE",
    iconColor: colors.success,
    screen: "CadastroProfessores",
  },
  {
    id: "disciplinas",
    label: "Disciplinas",
    sub: "Cadastrar disciplina",
    icon: "📚",
    color: "#FAEEDA",
    iconColor: colors.warning,
    screen: "CadastroDisciplinas",
  },
  {
    id: "boletim",
    label: "Boletim",
    sub: "Consultar notas",
    icon: "📋",
    color: "#FCEBEB",
    iconColor: colors.danger,
    screen: "Boletim",
  },
];

export default function DashboardScreen({ navigation }) {
  const { usuario, logout } = useAuth();
  const [dataAtual, setDataAtual] = useState("");
  const [totais, setTotais] = useState({
    alunos: 0,
    professores: 0,
    disciplinas: 0,
  });

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setDataAtual(formatted.charAt(0).toUpperCase() + formatted.slice(1));
    console.log("[DashboardScreen] Dashboard montado. Usuário:", usuario?.nome);
  }, []);

  // 2. totais — roda toda vez que voltar para o Dashboard
  useFocusEffect(
    useCallback(() => {
      Promise.all([
        alunosService.listar(),
        professoresService.listar(),
        disciplinasService.listar(),
      ])
        .then(([a, p, d]) => {
          setTotais({
            alunos: a.data.length,
            professores: p.data.length,
            disciplinas: d.data.length,
          });
        })
        .catch(() => {});
    }, []),
  );

  function handleLogout() {
    logout();
  }

  const stats = [
    { label: "Alunos", value: totais.alunos, screen: "AlunosList" },
    { label: "Professores", value: totais.professores },
    { label: "Disciplinas", value: totais.disciplinas },
    { label: "Semestre", value: "2025/1" },
  ];

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              Olá, {usuario?.nome || "Administrador"}
            </Text>
            <Text style={styles.date}>{dataAtual}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats */}
          <View style={styles.statsGrid}>
            {stats.map((s) => (
              <TouchableOpacity
                key={s.label}
                style={styles.statCard}
                onPress={() => s.screen && navigation.navigate(s.screen)}
                activeOpacity={s.screen ? 0.7 : 1}
              >
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Nav */}
          <Text style={styles.sectionTitle}>Módulos do sistema</Text>
          <View style={styles.navGrid}>
            {NAV_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.navCard}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.iconWrap, { backgroundColor: item.color }]}
                >
                  <Text style={styles.navIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.navLabel}>{item.label}</Text>
                <Text style={styles.navSub}>{item.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary }, // ← azul na área do relógio
  container: { flex: 1, backgroundColor: colors.background }, // ← fundo normal no resto
  header: {
    backgroundColor: colors.primary,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  greeting: { fontSize: 18, fontWeight: "600", color: colors.white },
  date: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  logoutText: { color: colors.white, fontSize: 13, fontWeight: "500" },
  body: { padding: spacing.lg, paddingBottom: 32 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: spacing.lg,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    width: "47.5%",
  },
  statLabel: { fontSize: 11, fontWeight: "600", color: colors.textSecondary },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  navGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  navCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    width: "47.5%",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  navSub: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
});
