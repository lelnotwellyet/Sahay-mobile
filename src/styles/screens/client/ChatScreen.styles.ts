import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#6C63FF', alignItems: 'center', justifyContent: 'center',
  },
  headerName: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  headerStatus: { fontSize: 12, color: '#4CAF50', fontWeight: '600' },

  // Input bar
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#eee',
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 42, maxHeight: 120,
    backgroundColor: '#F0F4FF',
    borderRadius: 21,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15,
    color: '#1A1A2E',
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#6C63FF',
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#C5C0FF' },
});
