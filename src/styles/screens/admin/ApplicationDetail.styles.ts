import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.dark },
  profileCard: {
    alignItems: 'center', backgroundColor: colors.white,
    marginHorizontal: 24, borderRadius: 20, padding: 24, marginTop: 8, marginBottom: 16, ...shadow.card,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: colors.white },
  name: { fontSize: 20, fontWeight: '800', color: colors.dark, marginBottom: 4 },
  spec: { fontSize: 14, color: colors.primary, fontWeight: '600', marginBottom: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '700' },
  section: {
    backgroundColor: colors.white, marginHorizontal: 24,
    borderRadius: 20, padding: 20, marginBottom: 12, ...shadow.soft,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.dark, marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  infoIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  infoLabel: { fontSize: 12, color: colors.subtext, marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '600', color: colors.dark },
  bioText: { fontSize: 14, color: '#555', lineHeight: 22 },
  licenseImage: { width: '100%', height: 220, borderRadius: 12, backgroundColor: '#f5f5f5' },
  noImage: { height: 140, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', borderRadius: 12, gap: 8 },
  noImageText: { fontSize: 13, color: '#ccc' },
  actions: { flexDirection: 'row', marginHorizontal: 24, gap: 12, marginTop: 8 },
  rejectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: 16, borderWidth: 2, borderColor: '#FF4444', gap: 8,
  },
  rejectBtnText: { color: '#FF4444', fontSize: 15, fontWeight: '700' },
  approveBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: 16, backgroundColor: colors.primary, gap: 8, ...shadow.button,
  },
  approveBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  approvedBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9',
    marginHorizontal: 24, borderRadius: 14, padding: 14, gap: 10, marginTop: 8,
  },
  approvedBannerText: { color: colors.success, fontWeight: '600', fontSize: 14 },
});
