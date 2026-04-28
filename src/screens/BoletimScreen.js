import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { boletimService } from '../services';

function CardNota({ item }) {
  const aprovado = item.situacao === 'Aprovado';
  return (
    <View style={styles.card}>
      <Text style={styles.cardDisciplina}>{item.disciplina}</Text>
      <Text style={styles.cardProfessor}>Prof. {item.professor || '—'}</Text>
      <View style={styles.cardNotas}>
        <View style={styles.notaItem}>
          <Text style={styles.notaLabel}>Nota 1</Text>
          <Text style={styles.notaValor}>{item.nota1}</Text>
        </View>
        <View style={styles.notaItem}>
          <Text style={styles.notaLabel}>Nota 2</Text>
          <Text style={styles.notaValor}>{item.nota2}</Text>
        </View>
        <View style={styles.notaItem}>
          <Text style={styles.notaLabel}>Média</Text>
          <Text style={[styles.notaValor, styles.mediaValor]}>{item.media}</Text>
        </View>
        <View style={[styles.badge, aprovado ? styles.badgeAprovado : styles.badgeReprovado]}>
          <Text style={styles.badgeTexto}>{item.situacao}</Text>
        </View>
      </View>
    </View>
  );
}

export default function BoletimScreen() {
  const [matricula, setMatricula] = useState('');
  const [boletim,   setBoletim]   = useState(null);
  const [loading,   setLoading]   = useState(false);

  async function handleBuscar() {
    if (!matricula.trim()) {
      Alert.alert('Atenção', 'Informe a matrícula');
      return;
    }
    setLoading(true);
    setBoletim(null);
    try {
      const response = await boletimService.consultar(matricula.trim());
      setBoletim(response.data);
    } catch (err) {
      const mensagem = err.response?.data?.error || 'Erro ao buscar boletim';
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Consulta de Boletim</Text>

      <View style={styles.busca}>
        <TextInput
          style={styles.input}
          placeholder="Matrícula do aluno"
          value={matricula}
          onChangeText={setMatricula}
          keyboardType="default"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.botaoBusca} onPress={handleBuscar} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.botaoTexto}>Buscar</Text>
          }
        </TouchableOpacity>
      </View>

      {boletim && (
        <>
          <View style={styles.infoAluno}>
            <Text style={styles.nomeAluno}>{boletim.aluno}</Text>
            <Text style={styles.infoTexto}>{boletim.curso} · {boletim.matricula}</Text>
          </View>

          <FlatList
            data={boletim.disciplinas}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => <CardNota item={item} />}
            ListEmptyComponent={
              <Text style={styles.vazio}>Nenhuma nota cadastrada</Text>
            }
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  titulo:          { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1a1a2e' },
  busca:           { flexDirection: 'row', marginBottom: 20, gap: 8 },
  input:           { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
                     borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
  botaoBusca:      { backgroundColor: '#1a1a2e', borderRadius: 8, paddingHorizontal: 16,
                     justifyContent: 'center', alignItems: 'center', minWidth: 70 },
  botaoTexto:      { color: '#fff', fontWeight: 'bold' },
  infoAluno:       { backgroundColor: '#1a1a2e', borderRadius: 10, padding: 16, marginBottom: 16 },
  nomeAluno:       { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  infoTexto:       { color: '#aaa', fontSize: 13, marginTop: 4 },
  card:            { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12,
                     elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4 },
  cardDisciplina:  { fontSize: 15, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 2 },
  cardProfessor:   { fontSize: 12, color: '#888', marginBottom: 10 },
  cardNotas:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notaItem:        { alignItems: 'center' },
  notaLabel:       { fontSize: 11, color: '#999' },
  notaValor:       { fontSize: 15, fontWeight: '600', color: '#333' },
  mediaValor:      { color: '#1a1a2e', fontSize: 17 },
  badge:           { marginLeft: 'auto', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  badgeAprovado:   { backgroundColor: '#d4edda' },
  badgeReprovado:  { backgroundColor: '#f8d7da' },
  badgeTexto:      { fontSize: 12, fontWeight: 'bold', color: '#333' },
  vazio:           { textAlign: 'center', color: '#999', marginTop: 40 },
});
