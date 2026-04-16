import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HELPLINE_NUMBER = '9152987821';

interface Props {
  compact?: boolean;
}

/**
 * Tappable crisis helpline banner.
 * Calls iCall (9152987821) when tapped.
 */
export default function CrisisHelplineBanner({ compact = false }: Props) {
  const handlePress = () => {
    Linking.openURL(`tel:${HELPLINE_NUMBER}`);
  };

  if (compact) {
    return (
      <TouchableOpacity style={s.compact} onPress={handlePress} activeOpacity={0.8}>
        <Ionicons name="call" size={14} color="#D32F2F" />
        <Text style={s.compactText}>
          Crisis? Call <Text style={s.compactNumber}>iCall: {HELPLINE_NUMBER}</Text>
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={s.banner} onPress={handlePress} activeOpacity={0.85}>
      <View style={s.iconCircle}>
        <Ionicons name="call" size={18} color="#fff" />
      </View>
      <View style={s.textWrap}>
        <Text style={s.title}>Need immediate help?</Text>
        <Text style={s.subtitle}>
          Tap to call iCall: <Text style={s.number}>{HELPLINE_NUMBER}</Text>
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#D32F2F" style={{ opacity: 0.6 }} />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 24,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#D32F2F',
  },
  number: {
    fontWeight: '800',
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 12,
  },
  compactText: {
    fontSize: 13,
    color: '#D32F2F',
  },
  compactNumber: {
    fontWeight: '800',
  },
});
