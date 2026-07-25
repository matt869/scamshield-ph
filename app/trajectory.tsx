import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';

/**
 * Timeline of the scammer's predicted next moves — turning the analysis into
 * foresight so the user recognizes each step when it happens.
 */
export default function TrajectoryScreen() {
  const analysis = useAppStore((s) => s.currentAnalysis);

  if (!analysis || analysis.trajectory.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>
          No predicted trajectory for this message — analyze a suspicious message first.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        If you keep engaging, here's how this {analysis.categoryLabel.toLowerCase()} will most
        likely escalate. Knowing the script is the best defense — pag nangyari ito, sigurado ka na.
      </Text>

      {analysis.trajectory.map((step, i) => {
        const isLast = i === analysis.trajectory.length - 1;
        return (
          <View key={step.stage} style={styles.row}>
            <View style={styles.timeline}>
              <View style={styles.node}>
                <Text style={styles.nodeText}>{step.stage}</Text>
              </View>
              {!isLast && <View style={styles.connector} />}
            </View>
            <View style={[styles.card, isLast && styles.lastCard]}>
              <Text style={styles.timeframe}>{step.timeframe}</Text>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
        );
      })}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🛑 The safest move is to stop replying now, block the sender, and warn anyone else they
          might target.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 20, paddingBottom: 48 },
  emptyWrap: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: { color: '#94A3B8', fontSize: 14, textAlign: 'center', lineHeight: 21 },
  intro: { color: '#94A3B8', fontSize: 14, lineHeight: 21, marginBottom: 22 },
  row: { flexDirection: 'row' },
  timeline: { alignItems: 'center', width: 40 },
  node: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#7C2D12',
    borderWidth: 1.5,
    borderColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeText: { color: '#FDBA74', fontWeight: '800', fontSize: 13 },
  connector: { flex: 1, width: 2, backgroundColor: '#334155', marginVertical: 4 },
  card: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 14,
    marginLeft: 10,
    marginBottom: 16,
  },
  lastCard: { marginBottom: 0 },
  timeframe: {
    color: '#F97316',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stepTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '700', marginTop: 4 },
  stepDescription: { color: '#94A3B8', fontSize: 13, lineHeight: 19, marginTop: 4 },
  footer: {
    marginTop: 24,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#7F1D1D',
  },
  footerText: { color: '#FCA5A5', fontSize: 13, lineHeight: 19 },
});
