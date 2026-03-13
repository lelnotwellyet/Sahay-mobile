import { StyleSheet } from 'react-native';

export const colors = {
  primary:      '#6C63FF',
  primaryLight: '#EEF0FF',
  background:   '#F0F4FF',
  dark:         '#1A1A2E',
  success:      '#4CAF50',
  warning:      '#FF9800',
  error:        '#F44336',
  text:         '#666',
  subtext:      '#999',
  border:       '#eee',
  white:        '#fff',
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const common = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.background },
  centered:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
    ...shadow.button,
  },
  primaryBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 4, borderWidth: 1, borderColor: 'transparent',
    ...shadow.soft,
  },
  inputError:  { borderColor: '#FF4444' },
  inputIcon:   { marginRight: 12 },
  input:       { flex: 1, fontSize: 16, color: colors.dark },
  errorText:   { color: '#FF4444', fontSize: 12, marginBottom: 12, marginLeft: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.dark, marginHorizontal: 24, marginBottom: 12 },
  card: {
    backgroundColor: colors.white, borderRadius: 20,
    padding: 16, marginBottom: 14,
    ...shadow.card,
  },
  actionCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, marginHorizontal: 24,
    borderRadius: 16, padding: 16, marginBottom: 12,
    gap: 12, ...shadow.soft,
  },
  actionIcon:  { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontSize: 15, fontWeight: '700', color: colors.dark },
  actionSub:   { fontSize: 13, color: colors.subtext, marginTop: 2 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16,
  },
  emptyState:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyTitle:  { fontSize: 20, fontWeight: '800', color: colors.dark, marginTop: 16, marginBottom: 8 },
  emptyDesc:   { fontSize: 14, color: colors.subtext, textAlign: 'center', lineHeight: 22 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText:  { fontWeight: '800', color: colors.white },
});
