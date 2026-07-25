import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ConfidenceMeter, VERDICT_COLORS, VERDICT_LABELS } from '../components/ConfidenceMeter';
import { useAppStore } from '../store/useAppStore';

export default function ResultScreen() {
  const router = useRouter();
  const analysis = useAppStore((s) => s.currentAnalysis);

  if (!analysis) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>No analysis yet.</Text>
        <Pressable style={styles.emptyButton} onPress={() => router.replace('/')}>
          <Text style={styles.emptyButtonText}>Go back home</Text>
        </Pressable>
      </View>
    );
  }

  const color = VERDICT_COLORS[analysis.verdict];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={[styles.banner, { borderColor: color }]}>
        <Text style={[styles.verdict, { color }]}>{VERDICT_LABELS[analysis.verdict]}</Text>
        <Text style={styles.category}>{analysis.categoryLabel}</Text>
        <View style={styles.meterWrap}>
          <ConfidenceMeter verdict={analysis.verdict} confidence={analysis.confidence} />
        </View>
      </View>

      <Text style={styles.summary}>{analysis.summary}</Text>
      <Text style={styles.explanation}>{analysis.explanation}</Text>

      {analysis.redFlags.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚩 Red flags in this message</Text>
          {analysis.redFlags.map((flag, i) => (
            <View key={i} style={styles.listRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{flag}</Text>
            </View>
          ))}
        </View>
      )}

      {analysis.recommendedActions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ What to do right now</Text>
          {analysis.recommendedActions.map((action, i) => (
            <View key={i} style={styles.listRow}>
              <Text style={styles.bullet}>{i + 1}.</Text>
              <Text style={styles.listText}>{action}</Text>
            </View>
          ))}
        </View>
      )}

      {analysis.trajectory.length > 0 && (
        <Link href="/trajectory" asChild>
          <Pressable style={styles.navCard}>
            <Text style={styles.navCardTitle}>🔮 What happens if you keep replying</Text>
            <Text style={styles.navCardHint}>
              See the scammer's predicted next {analysis.trajectory.length} moves →
            </Text>
          </Pressable>
        </Link>
      )}

      <Link href="/recovery" asChild>
        <Pressable style={styles.navCard}>
          <Text style={styles.navCardTitle}>🆘 Nabudol na ako / I already responded</Text>
          <Text style={styles.navCardHint}>Recovery steps and PH hotlines →</Text>
        </Pressable>
      </Link>

      <Link href="/thread" asChild>
        <Pressable style={[styles.navCard, styles.askCard]}>
          <Text style={styles.navCardTitle}>💬 Ask a follow-up question</Text>
          <Text style={styles.navCardHint}>"Paano ko malalaman kung legit?" →</Text>
        </Pressable>
      </Link>

      {analysis.extractedText ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analyzed message (personal info masked)</Text>
          <View style={styles.extractBox}>
            <Text style={styles.extractText}>{analysis.extractedText}</Text>
          </View>
        </View>
      ) : null}
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
    gap: 14,
  },
  emptyText: { color: '#94A3B8', fontSize: 15 },
  emptyButton: { backgroundColor: '#1E293B', borderRadius: 10, padding: 12 },
  emptyButtonText: { color: '#93C5FD', fontWeight: '600' },
  banner: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  verdict: { fontSize: 30, fontWeight: '900', letterSpacing: 2 },
  category: { color: '#CBD5E1', fontSize: 14, marginTop: 4 },
  meterWrap: { width: '100%', marginTop: 14 },
  summary: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
    marginTop: 18,
  },
  explanation: { color: '#94A3B8', fontSize: 14, lineHeight: 21, marginTop: 8 },
  section: { marginTop: 22 },
  sectionTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  listRow: { flexDirection: 'row', marginBottom: 6 },
  bullet: { color: '#64748B', width: 20, fontSize: 14 },
  listText: { color: '#CBD5E1', fontSize: 14, lineHeight: 20, flex: 1 },
  navCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  askCard: { borderColor: '#2563EB' },
  navCardTitle: { color: '#E2E8F0', fontSize: 15, fontWeight: '700' },
  navCardHint: { color: '#64748B', fontSize: 12, marginTop: 4 },
  extractBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
  },
  extractText: { color: '#94A3B8', fontSize: 13, lineHeight: 19 },
});
