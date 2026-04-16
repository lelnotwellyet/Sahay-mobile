import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/styles/theme';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },

  // Remote video — fullscreen background
  remoteVideo: {
    flex: 1,
    backgroundColor: '#000',
  },

  // Local video — small overlay in top-right
  localVideoWrap: {
    position: 'absolute',
    top: 100,
    right: 16,
    width: 120,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
    zIndex: 10,
  },
  localVideo: {
    flex: 1,
    backgroundColor: '#222',
  },

  // Header overlay
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 20,
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

  // Bottom controls bar
  controlsBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    zIndex: 20,
  },
  controlBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  controlBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  endBtn: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.error,
    alignItems: 'center', justifyContent: 'center',
  },
  endBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },

  // Connecting overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.dark, gap: 14, zIndex: 5,
  },
  loadingText: { color: colors.white, fontSize: 15, opacity: 0.7 },
  connectingSubtext: { color: colors.subtext, fontSize: 13, marginTop: 4 },

  // Camera-off placeholder
  cameraOffPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraOffText: { color: colors.subtext, fontSize: 14, marginTop: 8 },

  // Rating modal (kept from original)
  ratingOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  ratingCard: {
    backgroundColor: colors.white, borderRadius: 24,
    padding: 28, alignItems: 'center', width: '100%',
  },
  ratingTitle: { fontSize: 20, fontWeight: '800', color: colors.dark, marginBottom: 6 },
  ratingSubtitle: { fontSize: 14, color: colors.text, marginBottom: 24, textAlign: 'center' },
  starsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  skipBtn: { paddingVertical: 10, paddingHorizontal: 24 },
  skipText: { fontSize: 14, color: colors.subtext, fontWeight: '600' },
  submitRatingBtn: {
    backgroundColor: colors.primary, paddingVertical: 14,
    paddingHorizontal: 40, borderRadius: 16, marginBottom: 8,
  },
  submitRatingText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
