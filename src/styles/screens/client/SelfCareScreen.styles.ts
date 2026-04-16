import { StyleSheet } from 'react-native';
import { colors, shadow } from '@/styles/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.dark },
  moodBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 24, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12,
  },
  moodDot: { width: 10, height: 10, borderRadius: 5 },
  moodBannerText: { fontSize: 13, fontWeight: '600' },
  moodFilters: { paddingLeft: 24, paddingRight: 24, paddingBottom: 16, gap: 8 },
  moodChip: {
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 20, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border,
    flexShrink: 0, minWidth: 60, alignItems: 'center' as const, justifyContent: 'center' as const,
  },
  moodChipText: { fontSize: 13, fontWeight: '600', color: colors.text, textAlign: 'center' as const, flexShrink: 0 },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  videoCard: {
    backgroundColor: colors.white, borderRadius: 20, marginBottom: 16,
    overflow: 'hidden', ...shadow.card,
  },
  thumbnailContainer: { width: '100%', height: 180, position: 'relative' },
  thumbnail: { width: '100%', height: '100%' },
  playOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.15)',
  },
  playBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(108,99,255,0.9)', alignItems: 'center', justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute', bottom: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  durationText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  videoInfo: { padding: 14 },
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, marginBottom: 8 },
  categoryText: { fontSize: 11, fontWeight: '700' },
  videoTitle: { fontSize: 15, fontWeight: '700', color: colors.dark, marginBottom: 4, lineHeight: 21 },
  channelName: { fontSize: 12, color: colors.subtext },
  emptyState: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyTitle: { fontSize: 16, color: colors.subtext, fontWeight: '600' },
  videoModalHeader: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.dark, paddingHorizontal: 16, paddingVertical: 12, gap: 12,
  },
  videoModalClose: { padding: 4 },
  videoModalTitle: { flex: 1, color: colors.white, fontSize: 14, fontWeight: '700' },
});
