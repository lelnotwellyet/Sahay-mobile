import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.dark },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '700', color: colors.dark, marginBottom: 8, marginTop: 16 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 4, borderWidth: 1, borderColor: 'transparent',
    ...shadow.soft,
  },
  inputError: { borderColor: '#FF4444' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: colors.dark },
  textArea: { alignItems: 'flex-start', paddingTop: 14 },
  errorText: { color: '#FF4444', fontSize: 12, marginBottom: 4, marginLeft: 4 },
  specializationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  specBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border,
  },
  specBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  specText: { fontSize: 13, color: colors.text, fontWeight: '600' },
  specTextActive: { color: colors.white },
  saveBtn: {
    backgroundColor: colors.primary, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
    marginTop: 32, flexDirection: 'row', justifyContent: 'center', gap: 8,
    ...shadow.button,
  },
  saveBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  charCount: { fontSize: 12, color: colors.subtext, textAlign: 'right', marginTop: 4 },
});
