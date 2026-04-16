import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A2E' },

  scroll: { padding: 20 },

  // Summary card
  summaryCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20,
    marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  summaryLabel: { fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 12, letterSpacing: 1 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  summaryAvatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#6C63FF', alignItems: 'center', justifyContent: 'center',
  },
  summaryAvatarText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  summaryName: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  summarySpec: { fontSize: 13, color: '#666', marginTop: 2 },
  summaryDivider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 16 },
  summaryFeeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryFeeLabel: { fontSize: 14, color: '#666' },
  summaryFeeValue: { fontSize: 22, fontWeight: '800', color: '#6C63FF' },
  summaryDuration: { fontSize: 12, color: '#999', textAlign: 'right', marginTop: 2 },

  // Payment method
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },

  methodRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  methodBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 16,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 2, borderColor: '#eee',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  methodBtnActive: { borderColor: '#6C63FF', backgroundColor: '#EEF0FF' },
  methodText: { fontSize: 13, fontWeight: '600', color: '#666' },
  methodTextActive: { color: '#6C63FF' },

  // Input fields
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#eee',
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1A1A2E' },

  cardRow: { flexDirection: 'row', gap: 12 },

  // Security note
  secureNote: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#E8F5E9', borderRadius: 12, padding: 12, marginBottom: 24,
  },
  secureText: { fontSize: 12, color: '#4CAF50', fontWeight: '600', flex: 1 },

  // Pay button
  payBtn: {
    backgroundColor: '#6C63FF', borderRadius: 18,
    paddingVertical: 18, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
    shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 5,
    marginBottom: 32,
  },
  payBtnText: { fontSize: 17, fontWeight: '800', color: '#fff' },

  // Success overlay
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  successCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A2E' },
  successSub: { fontSize: 15, color: '#666', textAlign: 'center', paddingHorizontal: 40 },
});
