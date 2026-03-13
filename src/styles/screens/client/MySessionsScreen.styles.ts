import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.dark },
  filterRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 8, marginBottom: 16 },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border,
  },
  filterBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.subtext },
  filterTextActive: { color: colors.white },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 16, marginBottom: 14, ...shadow.card },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  psychAvatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  psychAvatarText: { fontSize: 18, fontWeight: '800', color: colors.white },
  psychName: { fontSize: 15, fontWeight: '700', color: colors.dark },
  specialization: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  detailsRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 12, color: colors.subtext },
  rejoinBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 10, marginTop: 12, gap: 6,
  },
  rejoinBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.dark, marginTop: 16, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: colors.subtext, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  findBtn: { backgroundColor: colors.primary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 16 },
  findBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
