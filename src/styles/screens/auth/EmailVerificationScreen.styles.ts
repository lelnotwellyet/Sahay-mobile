import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.background, padding: 30,
    justifyContent: 'center', alignItems: 'center'
  },
  iconBox: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.dark, marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.text, textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  primaryBtn: {
    backgroundColor: colors.primary, paddingVertical: 16, paddingHorizontal: 32,
    borderRadius: 16, alignItems: 'center', ...shadow.button, width: '100%', marginBottom: 16
  },
  primaryBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: colors.white, paddingVertical: 16, paddingHorizontal: 32,
    borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#ddd', width: '100%', marginBottom: 24
  },
  secondaryBtnText: { color: colors.dark, fontSize: 16, fontWeight: '600' },
  logoutText: { color: colors.subtext, fontSize: 14, fontWeight: '600', padding: 8 },
});
