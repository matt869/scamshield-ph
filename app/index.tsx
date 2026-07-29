import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { FloatingShazam } from '../components/FloatingShazam';
import { ScreenshotPicker } from '../components/ScreenshotPicker';
import { RedactionPreview } from '../components/RedactionPreview';
import { VERDICT_COLORS, VERDICT_LABELS } from '../components/ConfidenceMeter';
import { useScamAnalysis } from '../hooks/useScamAnalysis';
import { useAppStore } from '../store/useAppStore';
import { subscribeToFreshScreenshots, markScreenshotSeen } from '../services/platform/screenReader';
import type { RedactionResult, ScamAnalysis } from '../types';

export default function HomeScreen() {
  const router = useRouter();
  const { analyzeText, analyzeImage, prepareText, isAnalyzing } = useScamAnalysis();
  const { history, analysisError, clearError, selectAnalysis, removeFromHistory } = useAppStore();

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [preview, setPreview] = useState<RedactionResult | null>(null);

  // Shazam moment: user screenshots a scam, opens the app, we offer it.
  useEffect(() => {
    const unsubscribe = subscribeToFreshScreenshots((shot) => {
      Alert.alert(
        'Fresh screenshot detected',
        'Analyze the screenshot you just took?',
        [
          { text: 'Not now', style: 'cancel' },
          {
            text: 'Analyze',
            onPress: () => {
              markScreenshotSeen(shot.assetId);
              void analyzeImage(shot.uri);
            },
          },
        ]
      );
    });
    return unsubscribe;
  }, [analyzeImage]);

  useEffect(() => {
    if (analysisError) {
      Alert.alert('Analysis failed', analysisError, [{ text: 'OK', onPress: clearError }]);
    }
  }, [analysisError, clearError]);

  const onSubmitText = () => {
    const trimmed = pastedText.trim();
    if (trimmed.length < 10) {
      Alert.alert('Too short', 'Paste the full suspicious message so the analysis has enough to work with.');
      return;
    }
    setPreview(prepareText(trimmed));
  };

  const onConfirmPreview = () => {
    if (!preview) return;
    const text = preview.redacted;
    setPreview(null);
    setPastedText('');
    void analyzeText(text);
  };

  const openHistoryItem = (item: ScamAnalysis) => {
    selectAnalysis(item);
    router.push('/result');
  };

  const confirmDeleteHistoryItem = (item: ScamAnalysis) => {
    Alert.alert('Remove this check?', `"${item.categoryLabel}" will be removed from your history.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFromHistory(item.id) },
    ]);
  };

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={history}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View>
          <Text style={styles.tagline}>
            Nakareceive ka ba ng kahina-hinalang message?{'\n'}Screenshot it. Check it. Bago ka ma-budol.
          </Text>

          <FloatingShazam onPress={() => setPickerVisible(true)} busy={isAnalyzing} />
          {isAnalyzing && (
            <View style={styles.analyzingRow}>
              <ActivityIndicator color="#60A5FA" />
              <Text style={styles.analyzingText}>Analyzing with ScamShield…</Text>
            </View>
          )}

          <Text style={styles.orLabel}>— or paste the message —</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Paste the suspicious text, chat, or email here…"
            placeholderTextColor="#475569"
            value={pastedText}
            onChangeText={setPastedText}
            editable={!isAnalyzing}
          />
          <Pressable
            style={[styles.analyzeTextButton, (isAnalyzing || !pastedText.trim()) && styles.disabled]}
            onPress={onSubmitText}
            disabled={isAnalyzing || !pastedText.trim()}
          >
            <Text style={styles.analyzeTextLabel}>Check This Text</Text>
          </Pressable>

          <Link href="/learn" asChild>
            <Pressable style={styles.learnLink}>
              <Text style={styles.learnLinkText}>📚 Learn the most common scams in the PH</Text>
            </Pressable>
          </Link>

          {history.length > 0 && <Text style={styles.historyHeader}>Recent checks</Text>}
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.historyItem}
          onPress={() => openHistoryItem(item)}
          onLongPress={() => confirmDeleteHistoryItem(item)}
        >
          <View style={[styles.verdictDot, { backgroundColor: VERDICT_COLORS[item.verdict] }]} />
          <View style={styles.historyTextWrap}>
            <Text style={styles.historyTitle} numberOfLines={1}>
              {item.categoryLabel}
            </Text>
            <Text style={styles.historySummary} numberOfLines={2}>
              {item.summary}
            </Text>
          </View>
          <Text style={[styles.historyVerdict, { color: VERDICT_COLORS[item.verdict] }]}>
            {VERDICT_LABELS[item.verdict]}
          </Text>
        </Pressable>
      )}
      ListFooterComponent={
        <>
          <ScreenshotPicker
            visible={pickerVisible}
            onClose={() => setPickerVisible(false)}
            onPicked={(uri, base64) => void analyzeImage(uri, base64)}
          />
          <RedactionPreview
            visible={preview !== null}
            result={preview}
            onConfirm={onConfirmPreview}
            onCancel={() => setPreview(null)}
          />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 20, paddingBottom: 48 },
  tagline: {
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  analyzingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  analyzingText: { color: '#60A5FA', fontSize: 13 },
  orLabel: { color: '#475569', textAlign: 'center', marginVertical: 14, fontSize: 12 },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    color: '#E2E8F0',
    padding: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  analyzeTextButton: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  disabled: { opacity: 0.5 },
  analyzeTextLabel: { color: '#93C5FD', fontWeight: '700', fontSize: 15 },
  learnLink: { alignItems: 'center', marginTop: 18 },
  learnLinkText: { color: '#64748B', fontSize: 13 },
  historyHeader: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 26,
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  verdictDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  historyTextWrap: { flex: 1, marginRight: 8 },
  historyTitle: { color: '#E2E8F0', fontWeight: '600', fontSize: 14 },
  historySummary: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  historyVerdict: { fontSize: 11, fontWeight: '800' },
});
