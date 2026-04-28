import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { disciplinasService, professoresService } from '../services';

const SEMESTRES = ['1º Semestre', '2º Semestre', '3º Semestre',
                   '4º Semestre', '5º Semestre', '6º Semestre'];

export default function CadastroDisciplinaScreen({ navigation }) {
  const [form, setForm] = useState({
    nome:          '',
    carga_horaria: '',
    professor_id:  '',
    curso:         '',
    semestre:      '',
  });

  const [professores, setProfessores] = useState([]);
  const [loadingProf, setLoadingProf] = useState(true);
  const [erros,       setErros]       = useState({});
  const [loading,     setLoading]     = useState(false);

  // Carrega professores para o Picker
  useEffect(() => {
    professoresService.listar()
      .then((res) => setProfessores(res.data))
      .catch(() => Alert.alert('Aviso', 'Não foi possível carregar os professores'))
      .finally(() => setLoadingProf(false));
  }, []);

  function atualizar(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setErros(prev => ({ ...prev, [campo]: '' }));
  }

  function validar() {
    const novosErros = {};
    if (!form.nome.trim())          novosErros.nome          = 'Nome obrigatório';
    if (!form.carga_horaria.trim()) novosErros.carga_horaria = 'Carga horária obrigatória';
    else if (isNaN(Number(form.carga_horaria))) {
      novosErros.carga_horaria = 'Informe um número válido';
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSalvar() {
    if (!validar()) return;
    setLoading(true);
    try {
      await disciplinasService.criar({
        ...form,
        carga_horaria: Number(form.carga_horaria),
        professor_id:  form.professor_id || null,
      });
      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      const mensagem = err.response?.data?.error || 'Erro ao cadastrar disciplina';
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Disciplina</Text>

      {/* Nome */}
      <Text style={styles.label}>Nome da disciplina *</Text>
      <TextInput
        style={[styles.input, erros.nome && styles.inputErro]}
        value={form.nome}
        onChangeText={(v) => atualizar('nome', v)}
        autoCapitalize="words"
        placeholder="Ex: Programação Mobile"
      />
      {!!erros.nome && <Text style={styles.erro}>{erros.nome}</Text>}

      {/* Carga horária */}
      <Text style={styles.label}>Carga horária (horas) *</Text>
      <TextInput
        style={[styles.input, erros.carga_horaria && styles.inputErro]}
        value={form.carga_horaria}
        onChangeText={(v) => atualizar('carga_horaria', v)}
        keyboardType="numeric"
        placeholder="Ex: 80"
      />
      {!!erros.carga_horaria && <Text style={styles.erro}>{erros.carga_horaria}</Text>}

      {/* Professor responsável vindo do banco */}
      <Text style={styles.label}>Professor responsável</Text>
      {loadingProf
        ? <ActivityIndicator style={{ marginVertical: 10 }} />
        : (
          <View style={styles.picker}>
            <Picker
              selectedValue={form.professor_id}
              onValueChange={(v) => atualizar('professor_id', v)}
            >
              <Picker.Item label="Selecione..." value="" />
              {professores.map((p) => (
                <Picker.Item key={p.id} label={`${p.nome} — ${p.titulacao || 'sem titulação'}`} value={String(p.id)} />
              ))}
            </Picker>
          </View>
        )
      }

      {/* Curso */}
      <Text style={styles.label}>Curso</Text>
      <TextInput
        style={styles.input}
        value={form.curso}
        onChangeText={(v) => atualizar('curso', v)}
        autoCapitalize="characters"
        placeholder="Ex: DSM"
      />

      {/* Semestre */}
      <Text style={styles.label}>Semestre</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={form.semestre}
          onValueChange={(v) => atualizar('semestre', v)}
        >
          <Picker.Item label="Selecione..." value="" />
          {SEMESTRES.map((s) => (
            <Picker.Item key={s} label={s} value={s} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.botao, loading && styles.botaoDesabilitado]}
        onPress={handleSalvar}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botaoTexto}>Salvar Disciplina</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:         { padding: 20, paddingBottom: 40, backgroundColor: '#f5f5f5' },
  titulo:            { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1a1a2e' },
  label:             { fontSize: 13, color: '#555', marginBottom: 4, marginTop: 12 },
  input:             { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
                       borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
  inputErro:         { borderColor: '#e74c3c' },
  erro:              { color: '#e74c3c', fontSize: 12, marginTop: 2 },
  picker:            { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  botao:             { backgroundColor: '#1a1a2e', borderRadius: 8, paddingVertical: 14,
                       alignItems: 'center', marginTop: 28 },
  botaoDesabilitado: { backgroundColor: '#999' },
  botaoTexto:        { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
