import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: colors.dark },
  subGreeting: { fontSize: 14, color: colors.text, marginTop: 4 },
  anonBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryLight,
    marginHorizontal: 24, padding: 12, borderRadius: 12, gap: 8, marginBottom: 16,
  },
  anonText: { fontSize: 13, color: colors.text, flex: 1 },
  anonAlias: { color: colors.primary, fontWeight: '700' },
  card: {
    backgroundColor: colors.white, marginHorizontal: 24, borderRadius: 20,
    padding: 20, marginBottom: 16, ...shadow.soft,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.dark, marginBottom: 16 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: {
    alignItems: 'center', padding: 10, borderRadius: 12,
    borderWidth: 2, borderColor: 'transparent', flex: 1, marginHorizontal: 2,
  },
  moodEmoji: { fontSize: 24 },
  moodLabel: { fontSize: 11, color: colors.text, marginTop: 4, fontWeight: '600' },
  statsRow: { flexDirection: 'row', marginHorizontal: 24, gap: 12, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 4 },
  statNumber: { fontSize: 24, fontWeight: '800', color: colors.white },
  statLabel: { fontSize: 12, color: colors.white, opacity: 0.9 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.dark, marginHorizontal: 24, marginBottom: 12 },
  actionCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    marginHorizontal: 24, borderRadius: 16, padding: 16, marginBottom: 12, gap: 12, ...shadow.soft,
  },
  actionIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: colors.dark },
  actionSubtitle: { fontSize: 13, color: colors.subtext, marginTop: 2 },
  crisisCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3F3',
    marginHorizontal: 24, borderRadius: 12, padding: 14, gap: 8, marginBottom: 24,
    borderWidth: 1, borderColor: '#FFCDD2',
  },
  crisisText: { fontSize: 13, color: colors.text, flex: 1 },
  crisisNumber: { color: colors.error, fontWeight: '700' },
});
