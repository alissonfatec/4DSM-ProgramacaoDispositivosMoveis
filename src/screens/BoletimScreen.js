import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useBoletim } from '../hooks';
import { Badge, SelectInput } from '../components';
import { colors, spacing, radius } from '../styles/theme';

export default function BoletimScreen({ navigation }) {
  const { alunos, getBoletim } = useAppContext();
  const [alunoSelecionado, setAlunoSelecionado] = useState(alunos[0]?.id || '');
  const [notasRaw, setNotasRaw] = useState([]);

  const { notasComCalculo, aprovadas, reprovadas, recuperacao } = useBoletim(notasRaw);

  const alunoOptions = [
    { value: '', label: 'Selecione o aluno' },
    ...alunos.map(a => ({ value: a.id, label: `${a.nome} — ${a.matricula}` })),
  ];

  // useEffect — carrega boletim quando o aluno muda
  useEffect(() => {
    if (!alunoSelecionado) { setNotasRaw([]); return; }
    console.log('[BoletimScreen] Carregando boletim para alunoId:', alunoSelecionado);
    const notas = getBoletim(alunoSelecionado);
    setNotasRaw(notas);
  }, [alunoSelecionado]);

  const aluno = alunos.find(a => a.id === alunoSelecionado);

  return (
    <SafeAreaView style={styles.root}>
      {/* Filtro */}
      <View style={styles.filterBar}>
        <SelectInput
          value={alunoSelecionado}
          onValueChange={setAlunoSelecionado}
          options={alunoOptions}
        />
      </View>

      {aluno && (
        <View style={styles.alunoInfo}>
          <Text style={styles.alunoNome}>{aluno.nome}</Text>
          <Text style={styles.alunoMeta}>{aluno.matricula} · {aluno.curso} · 2025/1</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Resumo */}
        {notasComCalculo.length > 0 && (
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { borderColor: colors.successMid }]}>
              <Text style={[styles.summaryNum, { color: colors.success }]}>{aprovadas}</Text>
              <Text style={styles.summaryLabel}>Aprovadas</Text>
            </View>
            <View style={[styles.summaryCard, { borderColor: colors.warningMid }]}>
              <Text style={[styles.summaryNum, { color: colors.warning }]}>{recuperacao}</Text>
              <Text style={styles.summaryLabel}>Recuperação</Text>
            </View>
            <View style={[styles.summaryCard, { borderColor: colors.dangerMid }]}>
              <Text style={[styles.summaryNum, { color: colors.danger }]}>{reprovadas}</Text>
              <Text style={styles.summaryLabel}>Reprovadas</Text>
            </View>
          </View>
        )}

        {/* Tabela */}
        {notasComCalculo.length > 0 ? (
          <View style={styles.tableCard}>
            {/* Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.cellDisc, styles.headerText]}>Disciplina</Text>
              <Text style={[styles.cellNum, styles.headerText]}>N1</Text>
              <Text style={[styles.cellNum, styles.headerText]}>N2</Text>
              <Text style={[styles.cellNum, styles.headerText]}>Méd</Text>
              <Text style={[styles.cellSit, styles.headerText]}>Sit.</Text>
            </View>

            {notasComCalculo.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.tableRow,
                  idx % 2 === 0 && { backgroundColor: colors.background },
                  idx < notasComCalculo.length - 1 && styles.tableRowBorder,
                ]}
              >
                <Text style={[styles.cellDisc, styles.cellText]} numberOfLines={2}>
                  {item.disciplina}
                </Text>
                <Text style={[styles.cellNum, styles.cellText]}>{item.nota1.toFixed(1)}</Text>
                <Text style={[styles.cellNum, styles.cellText]}>{item.nota2.toFixed(1)}</Text>
                <Text style={[styles.cellNum, styles.cellText, { fontWeight: '600' }]}>
                  {item.media.toFixed(1)}
                </Text>
                <View style={styles.cellSit}>
                  <Badge label={item.situacao.label} type={item.situacao.type} />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Selecione um aluno para ver o boletim.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  filterBar: {
    padding: spacing.md,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  alunoInfo: {
    padding: spacing.md, paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  alunoNome: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  alunoMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  body: { padding: spacing.md, paddingBottom: 32 },
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  summaryCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, alignItems: 'center',
    borderWidth: 1,
  },
  summaryNum: { fontSize: 22, fontWeight: '700' },
  summaryLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  tableCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: spacing.md,
  },
  tableRowBorder: { borderBottomWidth: 0.5, borderBottomColor: colors.border },
  tableHeader: { backgroundColor: colors.background },
  headerText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase' },
  cellText: { fontSize: 13, color: colors.textPrimary },
  cellDisc: { flex: 3, paddingRight: 8 },
  cellNum: { flex: 1, textAlign: 'center' },
  cellSit: { flex: 2, alignItems: 'center' },
  empty: {
    padding: 40, alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 0.5, borderColor: colors.border,
  },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
});
