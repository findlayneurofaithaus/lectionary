import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

// TTS integration — uses react-native-tts
let Tts;
try { Tts = require('react-native-tts').default; } catch (e) { Tts = null; }

const TABS = ['First Reading', 'Psalm', 'Second Reading', 'Gospel'];

export default function ReadingScreen({ route, navigation }) {
  const { season, allReadings, label } = route.params || {};
  const [activeTab, setActiveTab] = useState(label || 'Gospel');
  const [isPlaying, setIsPlaying] = useState(false);
  const [ttsReady, setTtsReady] = useState(false);
  const [fontSize, setFontSize] = useState(17);

  useEffect(() => {
    if (Tts) {
      Tts.getInitStatus().then(() => setTtsReady(true)).catch(() => {});
      Tts.addEventListener('tts-finish', () => setIsPlaying(false));
      Tts.addEventListener('tts-cancel', () => setIsPlaying(false));
    }
    return () => {
      if (Tts) { Tts.stop(); }
    };
  }, []);

  const getCurrentReading = () => {
    if (!allReadings) return route.params?.reading;
    switch (activeTab) {
      case 'First Reading': return allReadings.firstReading;
      case 'Psalm': return allReadings.psalm;
      case 'Second Reading': return allReadings.secondReading;
      case 'Gospel': return allReadings.gospel;
    }
  };

  const reading = getCurrentReading();

  const handlePlay = () => {
    if (!reading) return;
    if (!Tts) {
      Alert.alert('Text-to-Speech', 'TTS is not available on this device.');
      return;
    }
    if (isPlaying) {
      Tts.stop();
      setIsPlaying(false);
    } else {
      const text = `${reading.ref}. ${reading.summary || ''}`;
      Tts.setDefaultRate(0.48);
      Tts.setDefaultPitch(1.0);
      Tts.speak(text);
      setIsPlaying(true);
    }
  };

  const seasonColor = season?.color || COLORS.primary;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: season?.lightColor || '#F8F5F0' }]}>
      {/* Season header */}
      <View style={[styles.topBar, { backgroundColor: seasonColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{season?.week || 'Readings'}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tabs */}
      {allReadings && (
        <View style={styles.tabRow}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && { borderBottomColor: seasonColor, borderBottomWidth: 2.5 }]}
              onPress={() => { setActiveTab(tab); if (isPlaying && Tts) { Tts.stop(); setIsPlaying(false); } }}
            >
              <Text style={[styles.tabText, activeTab === tab && { color: seasonColor, fontWeight: '700' }]}>
                {tab.replace(' Reading', '').replace('First', '1st').replace('Second', '2nd')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {reading ? (
          <>
            {/* Reference */}
            <View style={[styles.refBlock, { borderLeftColor: seasonColor }]}>
              <Text style={[styles.refLabel, { color: seasonColor }]}>{activeTab}</Text>
              <Text style={styles.refText}>{reading.ref}</Text>
            </View>

            {/* Summary / passage text */}
            <Text style={[styles.passageText, { fontSize }]}>
              {reading.summary || 'No text available.'}
            </Text>

            {/* Font size controls */}
            <View style={styles.fontControls}>
              <Text style={styles.fontLabel}>Text size</Text>
              <TouchableOpacity onPress={() => setFontSize(f => Math.max(13, f - 1))} style={styles.fontBtn}>
                <Text style={styles.fontBtnText}>A−</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFontSize(f => Math.min(26, f + 1))} style={styles.fontBtn}>
                <Text style={styles.fontBtnText}>A+</Text>
              </TouchableOpacity>
            </View>

            {/* Audio player */}
            <View style={styles.playerCard}>
              <View style={styles.playerLeft}>
                <Text style={styles.playerTitle}>Listen to reading</Text>
                <Text style={styles.playerSub}>Text-to-speech · {reading.ref}</Text>
              </View>
              <TouchableOpacity
                style={[styles.playBtn, { backgroundColor: seasonColor }]}
                onPress={handlePlay}
              >
                <Text style={styles.playBtnText}>{isPlaying ? '⏸' : '▶'}</Text>
              </TouchableOpacity>
            </View>

            {/* Reflection prompt */}
            <View style={styles.reflectCard}>
              <Text style={styles.reflectTitle}>For Reflection</Text>
              <Text style={styles.reflectText}>
                As you read {reading.ref}, consider:{'\n\n'}
                • What does this passage reveal about God's character?{'\n'}
                • How does this reading point to or illuminate the gospel?{'\n'}
                • What is the Spirit saying to you through this text today?{'\n'}
                • How might you proclaim or apply this in your ministry context?
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.noReading}>No reading available for this selection.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: 12,
  },
  backBtn: { width: 60 },
  backText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  topBarTitle: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  tabRow: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderBottomWidth: 0.5, borderBottomColor: '#E0D8CC',
  },
  tab: {
    flex: 1, paddingVertical: 12, alignItems: 'center',
    borderBottomWidth: 2.5, borderBottomColor: 'transparent',
  },
  tabText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
  content: { padding: SPACING.md, paddingBottom: 60 },
  refBlock: {
    borderLeftWidth: 3, paddingLeft: 12, marginBottom: SPACING.md,
  },
  refLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  refText: { fontSize: 20, fontWeight: '700', color: COLORS.text, fontFamily: 'Georgia' },
  passageText: {
    color: COLORS.text, lineHeight: 30, fontFamily: 'Georgia',
    marginBottom: SPACING.md,
  },
  fontControls: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: SPACING.md, paddingBottom: SPACING.md,
    borderBottomWidth: 0.5, borderBottomColor: '#E0D8CC',
  },
  fontLabel: { fontSize: 13, color: COLORS.textMuted, flex: 1 },
  fontBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.sm,
    borderWidth: 1, borderColor: '#E0D8CC', backgroundColor: '#fff',
  },
  fontBtnText: { fontSize: 14, color: COLORS.text, fontWeight: '600' },
  playerCard: {
    backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: SPACING.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  playerLeft: { flex: 1 },
  playerTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 3 },
  playerSub: { fontSize: 12, color: COLORS.textMuted },
  playBtn: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  playBtnText: { fontSize: 20, color: '#fff' },
  reflectCard: {
    backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  reflectTitle: {
    fontSize: 14, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm,
  },
  reflectText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, fontFamily: 'Georgia' },
  noReading: { fontSize: 16, color: COLORS.textMuted, textAlign: 'center', marginTop: 60 },
});
