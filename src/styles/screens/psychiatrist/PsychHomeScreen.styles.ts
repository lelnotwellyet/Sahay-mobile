import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: colors.dark },
  sub: { fontSize: 14, color: colors.primary, marginTop: 4, fontWeight: '600' },
  pendingBanner: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF8E1',
    marginHorizontal: 24, borderRadius: 16, padding: 16, gap: 12,
    marginBottom: 16, borderWidth: 1, borderColor: '#FFE082',
  },
  pendingTitle: { fontSize: 14, fontWeight: '700', color: '#E65100', marginBottom: 4 },
  pendingDesc: { fontSize: 13, color: '#795548', lineHeight: 18 },
  toggleCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.white, marginHorizontal: 24, borderRadius: 20,
    padding: 20, marginBottom: 20, ...shadow.card,
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  toggleLabel: { fontSize: 15, fontWeight: '700', color: colors.dark },
  toggleSub: { fontSize: 12, color: colors.subtext, marginTop: 2 },
  statsRow: { flexDirection: 'row', marginHorizontal: 24, gap: 10, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', gap: 4 },
  statNum: { fontSize: 22, fontWeight: '800', color: colors.white },
  statLabel: { fontSize: 11, color: colors.white, opacity: 0.9, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.dark, marginHorizontal: 24, marginBottom: 12 },
  actionCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    marginHorizontal: 24, borderRadius: 16, padding: 16, marginBottom: 12, gap: 12, ...shadow.soft,
  },
  actionIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: colors.dark },
  actionSub: { fontSize: 13, color: colors.subtext, marginTop: 2 },
  badge: {
    backgroundColor: '#FF4444', borderRadius: 10,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  ratingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.white, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    marginHorizontal: 24, marginBottom: 8,
    ...shadow,
  },
  ratingStars: { flexDirection: 'row', gap: 2 },
  ratingDate: { fontSize: 13, color: colors.subtext },
});
