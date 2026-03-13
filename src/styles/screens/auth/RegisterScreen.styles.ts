import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { paddingHorizontal: 30, paddingTop: 20, paddingBottom: 40 },
  back: { marginBottom: 20 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryLight,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    alignSelf: 'flex-start', gap: 6, marginBottom: 16,
  },
  roleText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '800', color: colors.dark },
  subtitle: { fontSize: 16, color: colors.text, marginTop: 8, marginBottom: 32 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 4, borderWidth: 1, borderColor: 'transparent', ...shadow.soft,
  },
  inputError: { borderColor: '#FF4444', borderWidth: 1 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: colors.dark },
  errorText: { color: '#FF4444', fontSize: 12, marginBottom: 12, marginLeft: 4 },
  strengthContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, marginTop: 4 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthText: { fontSize: 12, color: colors.text, width: 40 },
  infoBox: {
    flexDirection: 'row', backgroundColor: colors.primaryLight,
    borderRadius: 12, padding: 14, gap: 10, marginBottom: 20, marginTop: 8, alignItems: 'flex-start',
  },
  infoText: { flex: 1, color: colors.primary, fontSize: 13, lineHeight: 20 },
  registerBtn: {
    backgroundColor: colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center', marginTop: 8, ...shadow.button,
  },
  btnDisabled: { opacity: 0.7 },
  registerText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#ddd' },
  dividerText: { color: colors.subtext, fontSize: 14 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.white, paddingVertical: 14, borderRadius: 16,
    gap: 10, borderWidth: 1, borderColor: '#ddd', marginBottom: 8,
  },
  googleText: { color: colors.dark, fontSize: 15, fontWeight: '600' },
  loginLink: { textAlign: 'center', color: colors.subtext, fontSize: 14, marginTop: 16 },
  loginLinkBold: { color: colors.primary, fontWeight: '700' },
});
