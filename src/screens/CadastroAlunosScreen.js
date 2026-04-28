import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { alunosService, viaCepService, ibgeService } from '../services';

export default function CadastroAlunoScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '', matricula: '', curso: '', email: '',
    telefone: '', cep: '', endereco: '', cidade: '', estado: '',
  });

  const [estados,       setEstados]       = useState([]);
  const [cidades,       setCidades]       = useState([]);
  const [loadingCep,    setLoadingCep]    = useState(false);
  const [loadingEnvio,  setLoadingEnvio]  = useState(false);
  const [erros,         setErros]         = useState({});

  // Carrega estados ao montar
  useEffect(() => {
    ibgeService.listarEstados()
      .then(setEstados)
      .catch(() => Alert.alert('Aviso', 'Não foi possível carregar os estados'));
  }, []);

  // Carrega cidades quando estado muda
  useEffect(() => {
    if (!form.estado) return;
    ibgeService.listarCidades(form.estado)
      .then(setCidades)
      .catch(() => setCidades([]));
  }, [form.estado]);

  function atualizar(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setErros(prev => ({ ...prev, [campo]: '' }));
  }

  async function buscarCep(cep) {
    atualizar('cep', cep);
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    setLoadingCep(true);
    try {
      const dados = await viaCepService.buscar(cepLimpo);
      setForm(prev => ({
        ...prev,
        endereco: dados.logradouro || '',
        cidade:   dados.localidade || '',
        estado:   dados.uf         || '',
      }));
    } catch {
      Alert.alert('CEP', 'CEP não encontrado');
    } finally {
      setLoadingCep(false);
    }
  }

  function validar() {
    const novosErros = {};
    if (!form.nome.trim())      novosErros.nome      = 'Nome obrigatório';
    if (!form.matricula.trim()) novosErros.matricula = 'Matrícula obrigatória';
    if (!form.curso.trim())     novosErros.curso     = 'Curso obrigatório';
    if (!form.email.trim())     novosErros.email     = 'E-mail obrigatório';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSalvar() {
    if (!validar()) return;
    setLoadingEnvio(true);
    try {
      await alunosService.criar(form);
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      const mensagem = err.response?.data?.error || 'Erro ao cadastrar aluno';
      Alert.alert('Erro', mensagem);
    } finally {
      setLoadingEnvio(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Aluno</Text>

      {/* Campos de texto */}
      {[
        { campo: 'nome',      label: 'Nome completo',   keyboard: 'default' },
        { campo: 'matricula', label: 'Matrícula',        keyboard: 'default' },
        { campo: 'curso',     label: 'Curso',            keyboard: 'default' },
        { campo: 'email',     label: 'E-mail',           keyboard: 'email-address' },
        { campo: 'telefone',  label: 'Telefone',         keyboard: 'phone-pad' },
      ].map(({ campo, label, keyboard }) => (
        <View key={campo}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, erros[campo] && styles.inputErro]}
            value={form[campo]}
            onChangeText={(v) => atualizar(campo, v)}
            keyboardType={keyboard}
            autoCapitalize={keyboard === 'email-address' ? 'none' : 'words'}
          />
          {!!erros[campo] && <Text style={styles.erro}>{erros[campo]}</Text>}
        </View>
      ))}

      {/* CEP com busca automática */}
      <Text style={styles.label}>CEP</Text>
      <View style={styles.linha}>
        <TextInput
          style={[styles.input, styles.flex1]}
          value={form.cep}
          onChangeText={buscarCep}
          keyboardType="numeric"
          maxLength={9}
          placeholder="00000-000"
        />
        {loadingCep && <ActivityIndicator style={styles.spinnerCep} />}
      </View>

      <Text style={styles.label}>Endereço</Text>
      <TextInput
        style={styles.input}
        value={form.endereco}
        onChangeText={(v) => atualizar('endereco', v)}
      />

      {/* Estado via IBGE */}
      <Text style={styles.label}>Estado</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={form.estado}
          onValueChange={(v) => atualizar('estado', v)}
        >
          <Picker.Item label="Selecione..." value="" />
          {estados.map((e) => (
            <Picker.Item key={e.id} label={`${e.sigla} — ${e.nome}`} value={e.sigla} />
          ))}
        </Picker>
      </View>

      {/* Cidade via IBGE */}
      <Text style={styles.label}>Cidade</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={form.cidade}
          onValueChange={(v) => atualizar('cidade', v)}
          enabled={!!form.estado}
        >
          <Picker.Item label={form.estado ? 'Selecione...' : 'Selecione o estado primeiro'} value="" />
          {cidades.map((c) => (
            <Picker.Item key={c.id} label={c.nome} value={c.nome} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.botao, loadingEnvio && styles.botaoDesabilitado]}
        onPress={handleSalvar}
        disabled={loadingEnvio}
      >
        {loadingEnvio
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botaoTexto}>Salvar Aluno</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:          { padding: 20, paddingBottom: 40, backgroundColor: '#f5f5f5' },
  titulo:             { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1a1a2e' },
  label:              { fontSize: 13, color: '#555', marginBottom: 4, marginTop: 12 },
  input:              { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
                        borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
  inputErro:          { borderColor: '#e74c3c' },
  erro:               { color: '#e74c3c', fontSize: 12, marginTop: 2 },
  picker:             { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
                        borderRadius: 8, marginTop: 0 },
  linha:              { flexDirection: 'row', alignItems: 'center' },
  flex1:              { flex: 1 },
  spinnerCep:         { marginLeft: 10 },
  botao:              { backgroundColor: '#1a1a2e', borderRadius: 8, paddingVertical: 14,
                        alignItems: 'center', marginTop: 28 },
  botaoDesabilitado:  { backgroundColor: '#999' },
  botaoTexto:         { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
