import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLiturgicalSeason, getLectionaryYear, getReadingsForDate } from '../data/lectionary';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarScreen({ navigation }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(today);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDate = useCallback((day) => {
    const d = new Date(viewYear, viewMonth, day);
    setSelected(d);
  }, [viewYear, viewMonth]);

  const season = getLiturgicalSeason(selected);
  const lectionaryYear = getLectionaryYear(selected);
  const readings = getReadingsForDate(selected);

  const isToday = (day) => {
    return today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
  };
  const isSelected = (day) => {
    return selected.getDate() === day && selected.getMonth() === viewMonth && selected.getFullYear() === viewYear;
  };

  const getDayColor = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    const s = getLiturgicalSeason(d);
    return s.color;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Month navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
            <Text style={styles.navArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Day labels */}
        <View style={styles.dayLabelsRow}>
          {DAY_NAMES.map(d => (
            <Text key={d} style={styles.dayLabel}>{d}</Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.grid}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.cell} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const color = getDayColor(day);
            const todayDay = isToday(day);
            const selectedDay = isSelected(day);
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.cell,
                  selectedDay && { backgroundColor: color + '22', borderRadius: RADIUS.sm },
                ]}
                onPress={() => selectDate(day)}
              >
                <View style={[
                  styles.dayCircle,
                  todayDay && { backgroundColor: color },
                ]}>
                  <Text style={[
                    styles.dayNum,
                    todayDay && styles.dayNumToday,
                    selectedDay && !todayDay && { color },
                  ]}>{day}</Text>
                </View>
                <View style={[styles.seasonDot, { backgroundColor: color }]} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected day details */}
        {selected && (
          <View style={[styles.detailCard, { borderLeftColor: season.color }]}>
            <View style={styles.detailHeader}>
              <View style={[styles.seasonPill, { backgroundColor: season.color }]}>
                <Text style={styles.seasonPillText}>{season.name} · Year {lectionaryYear}</Text>
              </View>
            </View>
            <Text style={styles.detailDate}>
              {selected.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
            <Text style={styles.detailWeek}>{season.week}</Text>
            {readings && (
              <>
                <Text style={styles.detailTitle}>{readings.title}</Text>
                <View style={styles.refList}>
                  {readings.firstReading && <Text style={styles.refItem}>• {readings.firstReading.ref}</Text>}
                  {readings.psalm && <Text style={styles.refItem}>• {readings.psalm.ref}</Text>}
                  {readings.secondReading && <Text style={styles.refItem}>• {readings.secondReading.ref}</Text>}
                  {readings.gospel && <Text style={[styles.refItem, { fontWeight: '600' }]}>• {readings.gospel.ref} (Gospel)</Text>}
                </View>
                <TouchableOpacity
                  style={[styles.viewBtn, { backgroundColor: season.color }]}
                  onPress={() => navigation.navigate('Reading', {
                    reading: readings.gospel, label: 'Gospel', season, allReadings: readings,
                  })}
                >
                  <Text style={styles.viewBtnText}>View Readings</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Season legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Liturgical Seasons</Text>
          {[
            { name: 'Advent', color: '#4A1B8C' },
            { name: 'Christmas', color: '#C8960C' },
            { name: 'Epiphany', color: '#107A3B' },
            { name: 'Lent', color: '#6B4226' },
            { name: 'Easter', color: '#B8860B' },
            { name: 'Pentecost', color: '#B22222' },
            { name: 'Ordinary Time', color: '#2E7D32' },
          ].map(s => (
            <View key={s.name} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: s.color }]} />
              <Text style={styles.legendName}>{s.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F5F0' },
  container: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  monthNav: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  navBtn: { padding: SPACING.sm },
  navArrow: { fontSize: 28, color: COLORS.primary, fontWeight: '300' },
  monthTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, fontFamily: 'Georgia' },
  dayLabelsRow: { flexDirection: 'row', marginBottom: SPACING.xs },
  dayLabel: {
    flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '600',
    color: COLORS.textMuted, textTransform: 'uppercase',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: SPACING.md },
  cell: { width: '14.28%', alignItems: 'center', paddingVertical: 4 },
  dayCircle: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  dayNum: { fontSize: 14, color: COLORS.text },
  dayNumToday: { color: '#fff', fontWeight: '700' },
  seasonDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  detailCard: {
    backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.md, borderLeftWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  detailHeader: { marginBottom: SPACING.sm },
  seasonPill: {
    alignSelf: 'flex-start', borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  seasonPillText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  detailDate: { fontSize: 18, fontWeight: '700', color: COLORS.text, fontFamily: 'Georgia', marginBottom: 2 },
  detailWeek: { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  detailTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm, fontFamily: 'Georgia' },
  refList: { marginBottom: SPACING.md },
  refItem: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 3, fontFamily: 'Georgia' },
  viewBtn: {
    borderRadius: RADIUS.md, paddingVertical: 12,
    alignItems: 'center',
  },
  viewBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  legend: {
    backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  legendTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted, marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 1 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  legendName: { fontSize: 14, color: COLORS.text },
});
