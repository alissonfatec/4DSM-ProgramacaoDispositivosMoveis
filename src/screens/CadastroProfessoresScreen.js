import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { professoresService } from '../services';

const TITULACOES = ['Graduado', 'Especialista', 'Mestre', 'Doutor', 'Pós-Doutor'];

export default function CadastroProfessorScreen({ navigation }) {
  const [form, setForm] = useState({
    nome:           '',
    titulacao:      '',
    area:           '',
    tempo_docencia: '',
    email:          '',
  });

  const [erros,   setErros]   = useState({});
  const [loading, setLoading] = useState(false);

  function atualizar(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setErros(prev => ({ ...prev, [campo]: '' }));
  }

  function validar() {
    const novosErros = {};
    if (!form.nome.trim())  novosErros.nome  = 'Nome obrigatório';
    if (!form.email.trim()) novosErros.email = 'E-mail obrigatório';
    if (form.tempo_docencia && isNaN(Number(form.tempo_docencia))) {
      novosErros.tempo_docencia = 'Informe um número válido';
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSalvar() {
    if (!validar()) return;
    setLoading(true);
    try {
      await professoresService.criar({
        ...form,
        tempo_docencia: form.tempo_docencia ? Number(form.tempo_docencia) : null,
      });
      Alert.alert('Sucesso', 'Professor cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      const mensagem = err.response?.data?.error || 'Erro ao cadastrar professor';
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Professor</Text>

      {/* Nome */}
      <Text style={styles.label}>Nome completo *</Text>
      <TextInput
        style={[styles.input, erros.nome && styles.inputErro]}
        value={form.nome}
        onChangeText={(v) => atualizar('nome', v)}
        autoCapitalize="words"
      />
      {!!erros.nome && <Text style={styles.erro}>{erros.nome}</Text>}

      {/* Titulação */}
      <Text style={styles.label}>Titulação</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={form.titulacao}
          onValueChange={(v) => atualizar('titulacao', v)}
        >
          <Picker.Item label="Selecione..." value="" />
          {TITULACOES.map((t) => (
            <Picker.Item key={t} label={t} value={t} />
          ))}
        </Picker>
      </View>

      {/* Área de atuação */}
      <Text style={styles.label}>Área de atuação</Text>
      <TextInput
        style={styles.input}
        value={form.area}
        onChangeText={(v) => atualizar('area', v)}
        autoCapitalize="sentences"
        placeholder="Ex: Desenvolvimento Mobile"
      />

      {/* Tempo de docência */}
      <Text style={styles.label}>Tempo de docência (anos)</Text>
      <TextInput
        style={[styles.input, erros.tempo_docencia && styles.inputErro]}
        value={form.tempo_docencia}
        onChangeText={(v) => atualizar('tempo_docencia', v)}
        keyboardType="numeric"
        placeholder="Ex: 5"
      />
      {!!erros.tempo_docencia && <Text style={styles.erro}>{erros.tempo_docencia}</Text>}

      {/* Email */}
      <Text style={styles.label}>E-mail *</Text>
      <TextInput
        style={[styles.input, erros.email && styles.inputErro]}
        value={form.email}
        onChangeText={(v) => atualizar('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {!!erros.email && <Text style={styles.erro}>{erros.email}</Text>}

      <TouchableOpacity
        style={[styles.botao, loading && styles.botaoDesabilitado]}
        onPress={handleSalvar}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botaoTexto}>Salvar Professor</Text>
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
