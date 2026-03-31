import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { FormInput, PrimaryButton, AlertBanner } from '../components';
import { useForm, useFeedback } from '../hooks';
import { validators } from '../services/validators';
import { colors, spacing, radius } from '../styles/theme';

// Não recebe mais `navigation` — o redirecionamento pós-login é automático:
// quando login() seta isAuthenticated=true no contexto, o AppNavigator
// desmonta o PublicStack e monta o PrivateStack sem nenhum navigate() manual.
export default function LoginScreen() {
  const { login } = useAppContext();
  const { values, errors, setValue, validate } = useForm({ login: '', senha: '' });
  const { alert, showError } = useFeedback();
  const [loading, setLoading] = useState(false);

  // useEffect — log de montagem da tela
  useEffect(() => {
    console.log('[LoginScreen] Tela de login montada.');
  }, []);

  function handleLogin() {
    const isValid = validate({
      login: validators.required('Informe seu login ou e-mail.'),
      senha: validators.required('Informe sua senha.'),
    });

    if (!isValid) return;

    setLoading(true);

    // Simula latência de autenticação (useEffect seria usado com fetch real)
    setTimeout(() => {
      const ok = login(values.login.trim(), values.senha);
      if (!ok) {
        showError('Login ou senha inválidos. Use: admin / 1234');
      }
      // Se ok === true, o AppNavigator detecta isAuthenticated=true
      // e troca automaticamente para o PrivateStack.
      setLoading(false);
    }, 600);
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoMark}>
            <Text style={styles.logoIcon}>◈</Text>
          </View>
          <Text style={styles.appName}>App Scholar</Text>
          <Text style={styles.appSub}>Gerenciamento Acadêmico — FATEC Jacareí</Text>
        </View>

        {/* Card de login */}
        <View style={styles.card}>
          <AlertBanner message={alert.message} type={alert.type} />

          <FormInput
            label="Login ou e-mail"
            value={values.login}
            onChangeText={v => setValue('login', v)}
            placeholder="ra12345 ou email@fatec.sp.gov.br"
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.login}
          />

          <FormInput
            label="Senha"
            value={values.senha}
            onChangeText={v => setValue('senha', v)}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            error={errors.senha}
          />

          <PrimaryButton
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: spacing.sm }}
          />
        </View>

        <Text style={styles.hint}>Credenciais de teste: admin / 1234</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1, justifyContent: 'center',
    padding: spacing.lg, paddingVertical: 40,
  },
  logoArea: { alignItems: 'center', marginBottom: 28 },
  logoMark: {
    width: 64, height: 64, borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  logoIcon: { fontSize: 30, color: colors.white },
  appName: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  appSub: { fontSize: 13, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: spacing.xl, borderWidth: 0.5, borderColor: colors.border,
  },
  hint: {
    textAlign: 'center', marginTop: 16,
    fontSize: 12, color: colors.textMuted,
  },
});
