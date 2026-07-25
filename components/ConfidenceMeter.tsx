import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Verdict } from '../types';

interface Props {
  verdict: Verdict;
  /** 0-100 */
  confidence: number;
}

export const VERDICT_COLORS: Record<Verdict, string> = {
  scam: '#EF4444',
  suspicious: '#F59E0B',
  safe: '#10B981',
};

export const VERDICT_LABELS: Record<Verdict, string> = {
  scam: 'SCAM',
  suspicious: 'SUSPICIOUS',
  safe: 'LOOKS SAFE',
};

export function ConfidenceMeter({ verdict, confidence }: Props) {
  const color = VERDICT_COLORS[verdict];
  const pct = Math.max(0, Math.min(100, confidence));

  return (
    <View style={styles.wrap} accessibilityLabel={`Confidence ${pct} percent`}>
      <View style={styles.labelRow}>
        <Text style={styles.caption}>Confidence</Text>
        <Text style={[styles.value, { color }]}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  caption: { color: '#94A3B8', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontSize: 16, fontWeight: '800' },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E293B',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 5 },
});
