import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.dark },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 16, marginBottom: 14, ...shadow.card },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  avatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarText: { fontSize: 20, fontWeight: '800', color: colors.primary },
  cardInfo: { flex: 1 },
  clientName: { fontSize: 16, fontWeight: '700', color: colors.dark, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, gap: 4 },
  chatBadge: { backgroundColor: '#E8F5E9' },
  videoBadge: { backgroundColor: colors.primaryLight },
  typeText: { fontSize: 12, fontWeight: '600' },
  chatText: { color: colors.success },
  videoText: { color: colors.primary },
  timeAgo: { fontSize: 12, color: colors.subtext },
  activeBadge: { backgroundColor: '#E8F5E9', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  activeBadgeText: { color: colors.success, fontSize: 12, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 10 },
  declineBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#FF4444', gap: 6,
  },
  declineBtnText: { color: '#FF4444', fontWeight: '700', fontSize: 14 },
  acceptBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 12, backgroundColor: colors.primary, gap: 6,
  },
  acceptBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  rejoinBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 12, backgroundColor: colors.success, gap: 6,
  },
  rejoinBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.dark, marginTop: 16, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: colors.subtext, textAlign: 'center', lineHeight: 22 },
});
