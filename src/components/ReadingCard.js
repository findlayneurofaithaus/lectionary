import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function ReadingCard({ label, reference, summary, color, isGospel, onPress }) {
  return (
    <TouchableOpacity style={[styles.card, isGospel && styles.gospelCard]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.accent, { backgroundColor: color }]} />
      <View style={styles.body}>
        <Text style={[styles.label, { color }]}>{label}</Text>
        <Text style={styles.reference}>{reference}</Text>
        {summary && <Text style={styles.summary} numberOfLines={2}>{summary}</Text>}
      </View>
      <Text style={[styles.arrow, { color }]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: RADIUS.md, flexDirection: 'row',
    alignItems: 'center', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 4, elevation: 2,
  },
  gospelCard: {
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 4,
  },
  accent: { width: 4, alignSelf: 'stretch' },
  body: { flex: 1, padding: SPACING.md },
  label: {
    fontSize: 11, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 1, marginBottom: 3,
  },
  reference: { fontSize: 16, fontWeight: '700', color: COLORS.text, fontFamily: 'Georgia', marginBottom: 4 },
  summary: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  arrow: { fontSize: 24, paddingRight: SPACING.md, fontWeight: '300' },
});
