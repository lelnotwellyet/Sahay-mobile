import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between', paddingVertical: 40 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
  },
  appName: { fontSize: 42, fontWeight: '800', color: colors.dark, letterSpacing: 1 },
  tagline: { fontSize: 16, color: colors.text, textAlign: 'center', marginTop: 12, lineHeight: 24 },
  buttons: { paddingHorizontal: 30, gap: 12 },
  primaryBtn: {
    backgroundColor: colors.primary, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center', ...shadow.button,
  },
  primaryText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: colors.white, paddingVertical: 16,
    borderRadius: 16, alignItems: 'center', borderWidth: 2, borderColor: colors.primary,
  },
  secondaryText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  anonBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, gap: 8, borderRadius: 16, backgroundColor: colors.primaryLight,
  },
  anonText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  psychLink: { textAlign: 'center', color: colors.subtext, fontSize: 14, marginTop: 4 },
  psychLinkBold: { color: colors.primary, fontWeight: '700' },
});
