import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import {
  FormInput, SelectInput, PrimaryButton, SecondaryButton,
  AlertBanner, SectionTitle,
} from '../components';
import { useForm, useFeedback } from '../hooks';
import { validators } from '../services/validators';
import { colors, spacing } from '../styles/theme';

const TITULACOES = [
  { value: '', label: 'Selecione a titulação' },
  { value: 'Especialista', label: 'Especialista' },
  { value: 'Mestre (MSc)', label: 'Mestre (MSc)' },
  { value: 'Doutor (PhD)', label: 'Doutor (PhD)' },
  { value: 'Pós-doutor', label: 'Pós-doutor' },
];

const TEMPOS = [
  { value: '', label: 'Tempo de docência' },
  { value: 'Menos de 1 ano', label: 'Menos de 1 ano' },
  { value: '1 a 3 anos', label: '1 a 3 anos' },
  { value: '4 a 8 anos', label: '4 a 8 anos' },
  { value: '9 a 15 anos', label: '9 a 15 anos' },
  { value: 'Mais de 15 anos', label: 'Mais de 15 anos' },
];

export default function CadastroProfessoresScreen({ navigation }) {
  const { adicionarProfessor } = useAppContext();
  const { alert, showSuccess, showError } = useFeedback();
  const { values, errors, setValue, validate, reset } = useForm({
    nome: '', titulacao: '', area: '', tempo: '', email: '',
  });

  // useEffect — log de montagem
  useEffect(() => {
    console.log('[CadastroProfessoresScreen] Tela montada.');
  }, []);

  function handleSalvar() {
    const isValid = validate({
      nome: validators.minLength(2, 'Informe o nome completo.'),
      titulacao: validators.select('Selecione a titulação.'),
      area: validators.minLength(2, 'Informe a área de atuação.'),
      tempo: validators.select('Selecione o tempo de docência.'),
      email: validators.email,
    });

    if (!isValid) {
      showError('Corrija os campos obrigatórios.');
      return;
    }

    adicionarProfessor({ ...values });
    showSuccess('Professor cadastrado com sucesso!');
    reset();
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <AlertBanner message={alert.message} type={alert.type} />

        <SectionTitle title="Dados do professor" />

        <FormInput
          label="Nome completo *"
          value={values.nome}
          onChangeText={v => setValue('nome', v)}
          placeholder="Prof. Dr. Carlos Mendes"
          error={errors.nome}
        />
        <SelectInput
          label="Titulação *"
          value={values.titulacao}
          onValueChange={v => setValue('titulacao', v)}
          options={TITULACOES}
          error={errors.titulacao}
        />
        <FormInput
          label="Área de atuação *"
          value={values.area}
          onChangeText={v => setValue('area', v)}
          placeholder="Engenharia de Software, Banco de Dados…"
          error={errors.area}
        />
        <SelectInput
          label="Tempo de docência *"
          value={values.tempo}
          onValueChange={v => setValue('tempo', v)}
          options={TEMPOS}
          error={errors.tempo}
        />
        <FormInput
          label="E-mail *"
          value={values.email}
          onChangeText={v => setValue('email', v)}
          placeholder="professor@fatec.sp.gov.br"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <View style={{ marginTop: spacing.xl, gap: 10 }}>
          <PrimaryButton title="Salvar professor" onPress={handleSalvar} />
          <SecondaryButton title="Limpar formulário" onPress={reset} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  body: { padding: spacing.lg, paddingBottom: 40 },
});
