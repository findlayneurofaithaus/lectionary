import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export default function NotesScreen({ route, navigation }) {
  const { readings, season, date } = route.params || {};
  const [notes, setNotes] = useState('');
  const [theme, setTheme] = useState('');
  const [keyText, setKeyText] = useState('');
  const [saving, setSaving] = useState(false);

  const storageKey = `notes_${date?.split('T')[0] || 'default'}`;

  useEffect(() => {
    AsyncStorage.getItem(storageKey).then(val => {
      if (val) {
        try {
          const parsed = JSON.parse(val);
          setNotes(parsed.notes || '');
          setTheme(parsed.theme || '');
          setKeyText(parsed.keyText || '');
        } catch { setNotes(val); }
      }
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify({ notes, theme, keyText, date }));
      Alert.alert('Saved', 'Your sermon notes have been saved.');
    } catch {
      Alert.alert('Error', 'Could not save notes.');
    }
    setSaving(false);
  };

  const seasonColor = season?.color || COLORS.primary;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: seasonColor }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sermon Notes</Text>
          <TouchableOpacity onPress={save} style={styles.saveBtn} disabled={saving}>
            <Text style={styles.saveText}>{saving ? '...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Reading refs */}
          {readings && (
            <View style={[styles.refSummary, { borderLeftColor: seasonColor }]}>
              <Text style={[styles.refSummaryTitle, { color: seasonColor }]}>
                {season?.week} — {readings.title}
              </Text>
              <Text style={styles.refLine}>{readings.firstReading?.ref}</Text>
              <Text style={styles.refLine}>{readings.psalm?.ref}</Text>
              <Text style={styles.refLine}>{readings.secondReading?.ref}</Text>
              <Text style={[styles.refLine, { fontWeight: '700' }]}>{readings.gospel?.ref} (Gospel)</Text>
            </View>
          )}

          {/* Sermon theme */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Sermon Theme / Title</Text>
            <TextInput
              style={styles.shortInput}
              value={theme}
              onChangeText={setTheme}
              placeholder="e.g. The Grace of God Revealed"
              placeholderTextColor="#AAA"
            />
          </View>

          {/* Key text */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Key Text / Focus Passage</Text>
            <TextInput
              style={styles.shortInput}
              value={keyText}
              onChangeText={setKeyText}
              placeholder="e.g. John 3:16"
              placeholderTextColor="#AAA"
            />
          </View>

          {/* Main notes */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Notes & Outline</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder={`Introduction\n\nPoint 1:\n\nPoint 2:\n\nPoint 3:\n\nConclusion / Application:`}
              placeholderTextColor="#BBB"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Prompts */}
          <View style={styles.promptBox}>
            <Text style={styles.promptTitle}>Preparation Prompts</Text>
            <Text style={styles.promptText}>
              {'• What is the main claim of this passage?\n'}
              {'• What does this reveal about God — Father, Son, Spirit?\n'}
              {'• Where is the gospel in this text?\n'}
              {'• What is the pastoral/prophetic edge for this congregation?\n'}
              {'• How does the reading connect to the season of '}
              {season?.name || 'the church year'}{'?\n'}
              {'• What illustration, story, or image will make this land?'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F5F0' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: 12,
  },
  backBtn: { width: 60 },
  backText: { color: '#fff', fontSize: 16 },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  saveBtn: { width: 60, alignItems: 'flex-end' },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  content: { padding: SPACING.md, paddingBottom: 60 },
  refSummary: {
    backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.md,
    borderLeftWidth: 3, marginBottom: SPACING.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 1,
  },
  refSummaryTitle: { fontSize: 15, fontWeight: '700', marginBottom: SPACING.sm, fontFamily: 'Georgia' },
  refLine: { fontSize: 14, color: COLORS.textSecondary, fontFamily: 'Georgia', marginBottom: 2 },
  field: { marginBottom: SPACING.md },
  fieldLabel: {
    fontSize: 12, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6,
  },
  shortInput: {
    backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.md,
    fontSize: 15, color: COLORS.text, borderWidth: 0.5, borderColor: '#E0D8CC',
    fontFamily: 'Georgia',
  },
  notesInput: {
    backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.md,
    fontSize: 15, color: COLORS.text, borderWidth: 0.5, borderColor: '#E0D8CC',
    minHeight: 240, fontFamily: 'Georgia', lineHeight: 24,
  },
  promptBox: {
    backgroundColor: '#EEF2F7', borderRadius: RADIUS.md, padding: SPACING.md,
  },
  promptTitle: {
    fontSize: 12, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm,
  },
  promptText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, fontFamily: 'Georgia' },
});
