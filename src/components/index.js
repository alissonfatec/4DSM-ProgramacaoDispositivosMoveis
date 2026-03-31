import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Platform,
} from 'react-native';
import { colors, radius, spacing, globalStyles } from '../styles/theme';

// ─── FormInput ──────────────────────────────────────────────────────────────
export function FormInput({
  label, value, onChangeText, placeholder, keyboardType,
  secureTextEntry, error, autoCapitalize = 'sentences', maxLength,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          globalStyles.input,
          focused && globalStyles.inputFocused,
          error && globalStyles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType || 'default'}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ─── SelectInput ─────────────────────────────────────────────────────────────
export function SelectInput({ label, value, onValueChange, options, error }) {
  const [focused, setFocused] = useState(false);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.fieldGroup}>
        {label && <Text style={styles.label}>{label}</Text>}
        <select
          value={value}
          onChange={e => onValueChange(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', border: `0.5px solid ${error ? colors.dangerMid : colors.border}`,
            borderRadius: radius.md, fontSize: 14, color: value ? colors.textPrimary : colors.textMuted,
            backgroundColor: colors.surface, fontFamily: 'system-ui',
          }}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}
      </View>
    );
  }

  // Native fallback usando TextInput estilizado (substitua por Picker em projeto real)
  return (
    <FormInput
      label={label}
      value={value}
      onChangeText={onValueChange}
      placeholder={options[0]?.label || 'Selecione'}
      error={error}
    />
  );
}

// ─── PrimaryButton ────────────────────────────────────────────────────────────
export function PrimaryButton({ title, onPress, loading, style }) {
  return (
    <TouchableOpacity
      style={[globalStyles.btnPrimary, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading
        ? <ActivityIndicator color={colors.white} />
        : <Text style={globalStyles.btnPrimaryText}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

// ─── SecondaryButton ──────────────────────────────────────────────────────────
export function SecondaryButton({ title, onPress, style }) {
  return (
    <TouchableOpacity
      style={[globalStyles.btnSecondary, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={globalStyles.btnSecondaryText}>{title}</Text>
    </TouchableOpacity>
  );
}

// ─── AlertBanner ─────────────────────────────────────────────────────────────
export function AlertBanner({ message, type }) {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <View style={[
      styles.alert,
      { backgroundColor: isError ? colors.dangerLight : colors.successLight,
        borderColor: isError ? '#F09595' : '#97C459' }
    ]}>
      <Text style={{ fontSize: 13, color: isError ? colors.danger : colors.success }}>
        {message}
      </Text>
    </View>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ label, type }) {
  const map = {
    success: { bg: colors.successLight, color: colors.success },
    danger: { bg: colors.dangerLight, color: colors.danger },
    warning: { bg: colors.warningLight, color: colors.warning },
    info: { bg: colors.primaryLight, color: colors.primary },
  };
  const style = map[type] || map.info;
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.badgeText, { color: style.color }]}>{label}</Text>
    </View>
  );
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────
export function SectionTitle({ title }) {
  return <Text style={globalStyles.sectionTitle}>{title}</Text>;
}

// ─── Divider ─────────────────────────────────────────────────────────────────
export function Divider() {
  return <View style={globalStyles.divider} />;
}

const styles = StyleSheet.create({
  fieldGroup: { marginBottom: spacing.md },
  label: {
    fontSize: 12, fontWeight: '600', color: colors.textSecondary,
    marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.3,
  },
  alert: {
    padding: spacing.md, borderRadius: radius.md,
    borderWidth: 0.5, marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: radius.full, alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
});
