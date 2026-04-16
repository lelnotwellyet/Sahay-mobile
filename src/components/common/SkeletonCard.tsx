import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

function SkeletonBlock({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: '#D8D5F7', opacity },
        style,
      ]}
    />
  );
}

/** Skeleton card mimicking a psychiatrist listing card */
export function PsychCardSkeleton() {
  return (
    <View style={s.card}>
      <View style={s.cardRow}>
        <SkeletonBlock width={48} height={48} borderRadius={24} />
        <View style={s.cardLines}>
          <SkeletonBlock width="60%" height={16} />
          <SkeletonBlock width="40%" height={12} style={{ marginTop: 8 }} />
          <SkeletonBlock width="50%" height={12} style={{ marginTop: 8 }} />
        </View>
      </View>
      <SkeletonBlock width="100%" height={14} style={{ marginTop: 12 }} />
      <SkeletonBlock width="80%" height={14} style={{ marginTop: 6 }} />
      <SkeletonBlock width="100%" height={44} borderRadius={12} style={{ marginTop: 16 }} />
    </View>
  );
}

/** Skeleton card mimicking a session queue item */
export function SessionCardSkeleton() {
  return (
    <View style={s.card}>
      <View style={s.cardRow}>
        <SkeletonBlock width={44} height={44} borderRadius={22} />
        <View style={s.cardLines}>
          <SkeletonBlock width="50%" height={16} />
          <SkeletonBlock width="35%" height={12} style={{ marginTop: 8 }} />
        </View>
      </View>
      <View style={[s.cardRow, { marginTop: 14, gap: 10 }]}>
        <SkeletonBlock width="48%" height={40} borderRadius={10} />
        <SkeletonBlock width="48%" height={40} borderRadius={10} />
      </View>
    </View>
  );
}

/** Skeleton card mimicking a stat card on admin dashboard */
export function StatCardSkeleton() {
  return (
    <View style={s.statCard}>
      <SkeletonBlock width={28} height={28} borderRadius={14} />
      <SkeletonBlock width={40} height={24} style={{ marginTop: 10 }} />
      <SkeletonBlock width={60} height={12} style={{ marginTop: 6 }} />
    </View>
  );
}

/** Render N skeletons in a vertical list */
export function SkeletonList({
  count,
  type,
}: {
  count: number;
  type: 'psych' | 'session' | 'stat';
}) {
  const Component =
    type === 'psych' ? PsychCardSkeleton :
    type === 'session' ? SessionCardSkeleton :
    StatCardSkeleton;

  const isGrid = type === 'stat';

  return (
    <View style={isGrid ? s.grid : s.list}>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cardLines: {
    flex: 1,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  list: {
    paddingTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
});
