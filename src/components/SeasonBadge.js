import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RADIUS } from '../utils/theme';

export default function SeasonBadge({ season }) {
  if (!season) return null;
  return (
    <View style={[styles.badge, { backgroundColor: season.color }]}>
      <Text style={styles.text}>{season.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start', borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  text: { fontSize: 12, fontWeight: '700', color: '#fff' },
});
