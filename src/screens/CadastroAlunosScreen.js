import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import {
  FormInput, SelectInput, PrimaryButton, SecondaryButton,
  AlertBanner, SectionTitle,
} from '../components';
import { useForm, useFeedback } from '../hooks';
import { validators, formatters } from '../services/validators';
import { colors, spacing, radius } from '../styles/theme';

const CURSOS = [
  { value: '', label: 'Selecione o curso' },
  { value: 'DSM', label: 'DSM — Desenvolvimento de Software Multiplataforma' },
  { value: 'ADS', label: 'ADS — Análise e Desenvolvimento de Sistemas' },
  { value: 'GTI', label: 'GTI — Gestão em TI' },
  { value: 'SI', label: 'SI — Sistemas de Informação' },
];

const ESTADOS = [
  { value: '', label: 'UF' },
  { value: 'SP', label: 'SP' }, { value: 'RJ', label: 'RJ' },
  { value: 'MG', label: 'MG' }, { value: 'RS', label: 'RS' },
  { value: 'PR', label: 'PR' }, { value: 'SC', label: 'SC' },
  { value: 'BA', label: 'BA' }, { value: 'GO', label: 'GO' },
  { value: 'Outro', label: 'Outro' },
];

export default function CadastroAlunosScreen({ navigation }) {
  const { adicionarAluno } = useAppContext();
  const { alert, showSuccess, showError } = useFeedback();
  const { values, errors, setValue, validate, reset } = useForm({
    nome: '', matricula: '', curso: '', email: '',
    telefone: '', cep: '', endereco: '', cidade: '', estado: '',
  });

  // useEffect — inicialização da tela
  useEffect(() => {
    console.log('[CadastroAlunosScreen] Tela montada. Dados simulados prontos.');
  }, []);

  function handleSalvar() {
    const isValid = validate({
      nome: validators.minLength(2, 'Informe o nome completo.'),
      matricula: validators.minLength(3, 'Informe a matrícula.'),
      curso: validators.select('Selecione o curso.'),
      email: validators.email,
    });

    if (!isValid) {
      showError('Corrija os campos obrigatórios.');
      return;
    }

    adicionarAluno({ ...values });
    showSuccess('Aluno cadastrado com sucesso!');
    reset();
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <AlertBanner message={alert.message} type={alert.type} />

        <SectionTitle title="Dados pessoais" />

        <FormInput
          label="Nome completo *"
          value={values.nome}
          onChangeText={v => setValue('nome', v)}
          placeholder="Ex: Ana Paula Silva"
          error={errors.nome}
        />
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <FormInput
              label="Matrícula *"
              value={values.matricula}
              onChangeText={v => setValue('matricula', v)}
              placeholder="FA2024001"
              autoCapitalize="characters"
              error={errors.matricula}
            />
          </View>
          <View style={{ flex: 1 }}>
            <SelectInput
              label="Curso *"
              value={values.curso}
              onValueChange={v => setValue('curso', v)}
              options={CURSOS}
              error={errors.curso}
            />
          </View>
        </View>
        <FormInput
          label="E-mail *"
          value={values.email}
          onChangeText={v => setValue('email', v)}
          placeholder="aluno@fatec.sp.gov.br"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <FormInput
          label="Telefone"
          value={values.telefone}
          onChangeText={v => setValue('telefone', formatters.phone(v))}
          placeholder="(12) 99999-9999"
          keyboardType="phone-pad"
        />

        <SectionTitle title="Endereço" />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <FormInput
              label="CEP"
              value={values.cep}
              onChangeText={v => setValue('cep', formatters.cep(v))}
              placeholder="12345-678"
              keyboardType="numeric"
              maxLength={9}
            />
          </View>
          <View style={{ width: 90 }}>
            <SelectInput
              label="Estado"
              value={values.estado}
              onValueChange={v => setValue('estado', v)}
              options={ESTADOS}
            />
          </View>
        </View>
        <FormInput
          label="Endereço"
          value={values.endereco}
          onChangeText={v => setValue('endereco', v)}
          placeholder="Rua, número, complemento"
        />
        <FormInput
          label="Cidade"
          value={values.cidade}
          onChangeText={v => setValue('cidade', v)}
          placeholder="Jacareí"
        />

        <View style={{ marginTop: spacing.xl, gap: 10 }}>
          <PrimaryButton title="Salvar aluno" onPress={handleSalvar} />
          <SecondaryButton title="Limpar formulário" onPress={reset} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  body: { padding: spacing.lg, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
});
