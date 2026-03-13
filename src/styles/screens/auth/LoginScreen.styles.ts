import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, paddingHorizontal: 30, paddingTop: 20 },
  back: { marginBottom: 30 },
  title: { fontSize: 32, fontWeight: '800', color: colors.dark },
  subtitle: { fontSize: 16, color: colors.text, marginTop: 8, marginBottom: 40 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16, ...shadow.soft,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: colors.dark },
  loginBtn: {
    backgroundColor: colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center', marginTop: 8, ...shadow.button,
  },
  loginText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  registerLink: { textAlign: 'center', color: colors.subtext, fontSize: 14, marginTop: 20 },
  registerLinkBold: { color: colors.primary, fontWeight: '700' },
});
