import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Animated, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getLiturgicalSeason, getLectionaryYear, getReadingsForDate,
} from '../data/lectionary';
import { COLORS, SPACING, RADIUS } from '../utils/theme';
import ReadingCard from '../components/ReadingCard';
import SeasonBadge from '../components/SeasonBadge';

export default function HomeScreen({ navigation }) {
  const [today] = useState(new Date());
  const [season, setSeason] = useState(null);
  const [readings, setReadings] = useState(null);
  const [year, setYear] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const s = getLiturgicalSeason(today);
    const y = getLectionaryYear(today);
    const r = getReadingsForDate(today);
    setSeason(s);
    setYear(y);
    setReadings(r);
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

  if (!season || !readings) return null;

  const bgColor = season.lightColor || '#F8F5F0';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={bgColor} />
      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.dioceseName}>Sydney Anglican</Text>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>

        {/* Season Banner */}
        <View style={[styles.seasonBanner, { backgroundColor: season.color }]}>
          <View>
            <Text style={styles.seasonName}>{season.name}</Text>
            <Text style={styles.seasonWeek}>{season.week}</Text>
          </View>
          <View style={styles.yearBadge}>
            <Text style={styles.yearText}>Year {year}</Text>
          </View>
        </View>

        {/* Title */}
        {readings.title && (
          <View style={styles.titleBlock}>
            <Text style={styles.readingsTitle}>{readings.title}</Text>
            {readings.theme && (
              <Text style={styles.themeText}>{readings.theme}</Text>
            )}
          </View>
        )}

        {/* Reading Cards */}
        <View style={styles.readingsList}>
          <ReadingCard
            label="First Reading"
            reference={readings.firstReading?.ref}
            summary={readings.firstReading?.summary}
            color={season.color}
            onPress={() => navigation.navigate('Reading', {
              reading: readings.firstReading, label: 'First Reading', season
            })}
          />
          <ReadingCard
            label="Psalm"
            reference={readings.psalm?.ref}
            summary={readings.psalm?.summary}
            color={season.color}
            onPress={() => navigation.navigate('Reading', {
              reading: readings.psalm, label: 'Psalm', season
            })}
          />
          <ReadingCard
            label="Second Reading"
            reference={readings.secondReading?.ref}
            summary={readings.secondReading?.summary}
            color={season.color}
            onPress={() => navigation.navigate('Reading', {
              reading: readings.secondReading, label: 'Second Reading', season
            })}
          />
          <ReadingCard
            label="Gospel"
            reference={readings.gospel?.ref}
            summary={readings.gospel?.summary}
            color={season.color}
            isGospel
            onPress={() => navigation.navigate('Reading', {
              reading: readings.gospel, label: 'Gospel', season
            })}
          />
        </View>

        {/* Notes button */}
        <TouchableOpacity
          style={[styles.notesBtn, { borderColor: season.color }]}
          onPress={() => navigation.navigate('Notes', { readings, season, date: today.toISOString() })}
        >
          <Text style={[styles.notesBtnText, { color: season.color }]}>Sermon Notes</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  header: { marginBottom: SPACING.md },
  dioceseName: {
    fontSize: 13, fontWeight: '600', color: COLORS.textMuted,
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2,
  },
  dateText: { fontSize: 22, fontWeight: '700', color: COLORS.text, fontFamily: 'Georgia' },
  seasonBanner: {
    borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  seasonName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 2 },
  seasonWeek: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  yearBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  yearText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  titleBlock: { marginBottom: SPACING.md },
  readingsTitle: {
    fontSize: 22, fontWeight: '700', color: COLORS.text,
    fontFamily: 'Georgia', marginBottom: 4,
  },
  themeText: { fontSize: 14, color: COLORS.textSecondary, fontStyle: 'italic' },
  readingsList: { gap: SPACING.sm, marginBottom: SPACING.md },
  notesBtn: {
    borderWidth: 1.5, borderRadius: RADIUS.md, paddingVertical: 14,
    alignItems: 'center', marginTop: SPACING.sm,
  },
  notesBtnText: { fontSize: 15, fontWeight: '600' },
});
