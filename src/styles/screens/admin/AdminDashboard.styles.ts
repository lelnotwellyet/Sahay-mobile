import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.dark },
  subtitle: { fontSize: 14, color: colors.subtext, marginTop: 2 },
  alertBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1',
    marginHorizontal: 24, borderRadius: 14, padding: 14, gap: 10,
    marginBottom: 8, borderWidth: 1, borderColor: '#FFE082',
  },
  alertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning },
  alertText: { flex: 1, fontSize: 13, color: '#795548' },
  alertBold: { fontWeight: '700', color: '#E65100' },
  sectionTitle: {
    fontSize: 18, fontWeight: '700', color: colors.dark,
    marginHorizontal: 24, marginTop: 20, marginBottom: 12,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 24, gap: 12 },
  statCard: { width: '47%', borderRadius: 18, padding: 16, alignItems: 'center', gap: 6 },
  statNum: { fontSize: 28, fontWeight: '800', color: colors.white },
  statLabel: { fontSize: 12, color: colors.white, opacity: 0.9, textAlign: 'center', lineHeight: 16 },
  actionCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    marginHorizontal: 24, borderRadius: 16, padding: 16, marginBottom: 12, gap: 12, ...shadow.soft,
  },
  actionIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: colors.dark },
  actionSub: { fontSize: 13, color: colors.subtext, marginTop: 2 },
  badge: {
    backgroundColor: colors.warning, borderRadius: 10,
    minWidth: 22, height: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: '700' },
});
