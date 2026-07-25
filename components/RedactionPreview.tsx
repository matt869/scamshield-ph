import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RedactionResult } from '../types';

interface Props {
  visible: boolean;
  result: RedactionResult | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Shows the user exactly what will be sent for analysis after PII masking,
 * so nothing personal leaves the phone without their say-so.
 */
export function RedactionPreview({ visible, result, onConfirm, onCancel }: Props) {
  if (!result) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Before we analyze…</Text>
          <Text style={styles.subtitle}>
            {result.matches.length > 0
              ? `We masked ${result.matches.length} personal detail${
                  result.matches.length === 1 ? '' : 's'
                } so they never leave your phone:`
              : 'No personal details detected. This is what will be analyzed:'}
          </Text>

          {result.matches.length > 0 && (
            <View style={styles.chips}>
              {result.matches.map((m, i) => (
                <View key={i} style={styles.chip}>
                  <Text style={styles.chipText}>{m.kind}</Text>
                </View>
              ))}
            </View>
          )}

          <ScrollView style={styles.preview}>
            <Text style={styles.previewText}>{result.redacted}</Text>
          </ScrollView>

          <View style={styles.buttons}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
              <Text style={styles.confirmText}>Analyze</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  title: { color: '#F8FAFC', fontSize: 18, fontWeight: '700' },
  subtitle: { color: '#94A3B8', fontSize: 13, marginTop: 6, lineHeight: 18 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 6 },
  chip: {
    backgroundColor: '#334155',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: { color: '#CBD5E1', fontSize: 11 },
  preview: {
    marginTop: 14,
    backgroundColor: '#020617',
    borderRadius: 12,
    padding: 12,
    maxHeight: 220,
  },
  previewText: { color: '#E2E8F0', fontSize: 13, lineHeight: 19 },
  buttons: { flexDirection: 'row', marginTop: 16, gap: 10 },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelButton: { backgroundColor: '#1E293B' },
  confirmButton: { backgroundColor: '#2563EB' },
  cancelText: { color: '#CBD5E1', fontWeight: '600' },
  confirmText: { color: '#fff', fontWeight: '700' },
});
