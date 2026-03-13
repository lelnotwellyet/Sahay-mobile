import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.dark,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: colors.white },
  headerName: { fontSize: 15, fontWeight: '700', color: colors.white },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  liveText: { fontSize: 12, color: colors.success, fontWeight: '600' },
  endBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.error, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
  },
  endBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  webview: { flex: 1 },
  loadingOverlay: {
    position: 'absolute', top: 80, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.dark, gap: 14, zIndex: 10,
  },
  loadingText: { color: colors.white, fontSize: 15, opacity: 0.7 },
});
