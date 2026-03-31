import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import {
  FormInput, SelectInput, PrimaryButton, SecondaryButton,
  AlertBanner, SectionTitle,
} from '../components';
import { useForm, useFeedback } from '../hooks';
import { validators } from '../services/validators';
import { colors, spacing } from '../styles/theme';

const CARGAS = [
  { value: '', label: 'Carga horária' },
  { value: '40', label: '40 horas' },
  { value: '60', label: '60 horas' },
  { value: '80', label: '80 horas' },
  { value: '100', label: '100 horas' },
  { value: '120', label: '120 horas' },
];

const SEMESTRES = [
  { value: '', label: 'Semestre' },
  { value: '1º', label: '1º Semestre' },
  { value: '2º', label: '2º Semestre' },
  { value: '3º', label: '3º Semestre' },
  { value: '4º', label: '4º Semestre' },
  { value: '5º', label: '5º Semestre' },
  { value: '6º', label: '6º Semestre' },
];

const CURSOS = [
  { value: '', label: 'Selecione o curso' },
  { value: 'DSM', label: 'DSM' },
  { value: 'ADS', label: 'ADS' },
  { value: 'GTI', label: 'GTI' },
  { value: 'SI', label: 'SI' },
];

export default function CadastroDisciplinasScreen({ navigation }) {
  const { professores, adicionarDisciplina } = useAppContext();
  const { alert, showSuccess, showError } = useFeedback();
  const { values, errors, setValue, validate, reset } = useForm({
    nome: '', cargaHoraria: '', professor: '', curso: '', semestre: '',
  });

  // useState — opções de professores montadas dinamicamente
  const [professorOptions, setProfessorOptions] = useState([
    { value: '', label: 'Selecione o professor' },
  ]);

  // useEffect — carrega lista de professores do contexto ao montar
  useEffect(() => {
    console.log('[CadastroDisciplinasScreen] Carregando professores do contexto...');
    const opts = [
      { value: '', label: 'Selecione o professor' },
      ...professores.map(p => ({ value: p.nome, label: p.nome })),
    ];
    setProfessorOptions(opts);
  }, [professores]);

  function handleSalvar() {
    const isValid = validate({
      nome: validators.minLength(2, 'Informe o nome da disciplina.'),
      cargaHoraria: validators.select('Selecione a carga horária.'),
      semestre: validators.select('Selecione o semestre.'),
      professor: validators.select('Selecione o professor responsável.'),
      curso: validators.select('Selecione o curso.'),
    });

    if (!isValid) {
      showError('Corrija os campos obrigatórios.');
      return;
    }

    adicionarDisciplina({ ...values });
    showSuccess('Disciplina cadastrada com sucesso!');
    reset();
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <AlertBanner message={alert.message} type={alert.type} />

        <SectionTitle title="Dados da disciplina" />

        <FormInput
          label="Nome da disciplina *"
          value={values.nome}
          onChangeText={v => setValue('nome', v)}
          placeholder="Programação para Dispositivos Móveis I"
          error={errors.nome}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <SelectInput
              label="Carga horária *"
              value={values.cargaHoraria}
              onValueChange={v => setValue('cargaHoraria', v)}
              options={CARGAS}
              error={errors.cargaHoraria}
            />
          </View>
          <View style={{ flex: 1 }}>
            <SelectInput
              label="Semestre *"
              value={values.semestre}
              onValueChange={v => setValue('semestre', v)}
              options={SEMESTRES}
              error={errors.semestre}
            />
          </View>
        </View>

        <SelectInput
          label="Professor responsável *"
          value={values.professor}
          onValueChange={v => setValue('professor', v)}
          options={professorOptions}
          error={errors.professor}
        />

        <SelectInput
          label="Curso *"
          value={values.curso}
          onValueChange={v => setValue('curso', v)}
          options={CURSOS}
          error={errors.curso}
        />

        <View style={{ marginTop: spacing.xl, gap: 10 }}>
          <PrimaryButton title="Salvar disciplina" onPress={handleSalvar} />
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
