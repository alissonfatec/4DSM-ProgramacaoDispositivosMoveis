import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#185FA5',
  primaryDark: '#0C447C',
  primaryLight: '#E6F1FB',
  primaryMid: '#378ADD',

  success: '#3B6D11',
  successLight: '#EAF3DE',
  successMid: '#639922',

  danger: '#A32D2D',
  dangerLight: '#FCEBEB',
  dangerMid: '#E24B4A',

  warning: '#854F0B',
  warningLight: '#FAEEDA',
  warningMid: '#BA7517',

  white: '#FFFFFF',
  background: '#F8F7F4',
  surface: '#FFFFFF',
  border: '#E0DDD6',

  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B68',
  textMuted: '#9E9C97',
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24,
};

export const radius = {
  sm: 6, md: 8, lg: 12, xl: 16, full: 999,
};

export const typography = {
  h1: { fontSize: 22, fontWeight: '600', color: colors.textPrimary },
  h2: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  h3: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  body: { fontSize: 14, fontWeight: '400', color: colors.textPrimary },
  bodySmall: { fontSize: 13, fontWeight: '400', color: colors.textSecondary },
  caption: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
};

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  inputFocused: {
    borderColor: colors.primaryMid,
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: colors.dangerMid,
    borderWidth: 1,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  btnSecondary: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  btnSecondaryText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: colors.dangerMid,
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});
