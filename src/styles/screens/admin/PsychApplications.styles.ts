import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.dark },
  filterRow: {
    flexDirection: 'row', marginHorizontal: 24,
    backgroundColor: '#E8E6FF', borderRadius: 14, padding: 4, marginBottom: 16,
  },
  filterTab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  filterTabActive: { backgroundColor: colors.white },
  filterTabText: { fontSize: 14, fontWeight: '600', color: colors.subtext },
  filterTabTextActive: { color: colors.primary },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  card: { backgroundColor: colors.white, borderRadius: 18, padding: 16, marginBottom: 12, ...shadow.soft },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarText: { fontSize: 20, fontWeight: '800', color: colors.white },
  cardInfo: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.dark },
  spec: { fontSize: 13, color: colors.primary, fontWeight: '600', marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  metaText: { fontSize: 12, color: colors.subtext },
  dot: { color: '#ccc', fontSize: 12 },
  licenseRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  licenseText: { fontSize: 13, color: colors.subtext },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.dark, marginTop: 16, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: colors.subtext, textAlign: 'center', lineHeight: 22 },
});
