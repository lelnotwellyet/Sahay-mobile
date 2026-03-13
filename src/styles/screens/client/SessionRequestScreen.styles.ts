import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  inner: { paddingHorizontal: 24, paddingBottom: 40 },
  psychCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: 20, padding: 16, marginBottom: 28, gap: 14, ...shadow.card,
  },
  psychAvatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  psychAvatarText: { fontSize: 24, fontWeight: '800', color: colors.white },
  onlineDot: {
    width: 14, height: 14, borderRadius: 7, position: 'absolute',
    bottom: 0, right: 0, borderWidth: 2, borderColor: colors.white,
  },
  psychName: { fontSize: 17, fontWeight: '800', color: colors.dark },
  psychSpec: { fontSize: 13, color: colors.primary, fontWeight: '600', marginTop: 2 },
  psychMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  psychMetaText: { fontSize: 12, color: colors.subtext },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: colors.dark, marginBottom: 12 },
  typeCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: 18, padding: 16, marginBottom: 12, gap: 14,
    borderWidth: 2, borderColor: 'transparent', ...shadow.soft,
  },
  typeCardActive: { borderColor: colors.primary, backgroundColor: '#FAFAFE' },
  typeIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  typeTitle: { fontSize: 15, fontWeight: '700', color: colors.dark, marginBottom: 3 },
  typeTitleActive: { color: colors.primary },
  typeDesc: { fontSize: 13, color: colors.subtext, lineHeight: 18 },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  infoBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryLight,
    borderRadius: 12, padding: 12, gap: 8, marginTop: 4, marginBottom: 24,
  },
  infoText: { flex: 1, fontSize: 13, color: colors.primary, lineHeight: 18 },
  sendBtn: {
    flexDirection: 'row', backgroundColor: colors.primary,
    paddingVertical: 16, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', gap: 10, ...shadow.button,
  },
  sendBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  waitingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  pulseCircle: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 32,
  },
  pulseInner: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  pulseInitial: { fontSize: 36, fontWeight: '800', color: colors.white },
  waitingTitle: { fontSize: 22, fontWeight: '800', color: colors.dark, marginBottom: 10 },
  waitingDesc: { fontSize: 14, color: colors.text, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  waitingType: { color: colors.primary, fontWeight: '700' },
  waitingCard: {
    backgroundColor: colors.white, borderRadius: 16,
    paddingVertical: 20, paddingHorizontal: 32,
    alignItems: 'center', marginBottom: 32, ...shadow.card,
  },
  waitingCardText: { color: colors.subtext, fontSize: 14 },
  cancelBtn: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 16, borderWidth: 2, borderColor: '#FF4444' },
  cancelBtnText: { color: '#FF4444', fontSize: 15, fontWeight: '700' },
});
