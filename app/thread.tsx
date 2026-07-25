import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { continueThread } from '../services/ai/claudeService';
import type { ThreadMessage } from '../types';

const SUGGESTIONS = [
  'Paano ko sila ima-block at ire-report?',
  'What if I already replied to them?',
  'How do I check if this company is legit?',
];

export default function ThreadScreen() {
  const listRef = useRef<FlatList<ThreadMessage>>(null);
  const { currentAnalysis, threadMessages, addThreadMessage, isThreadBusy, setThreadBusy } =
    useAppStore();
  const [draft, setDraft] = useState('');

  if (!currentAnalysis) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Analyze a message first, then ask follow-up questions here.</Text>
      </View>
    );
  }

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || isThreadBusy) return;
    setDraft('');
    addThreadMessage({ role: 'user', text: message });
    setThreadBusy(true);
    try {
      const history = useAppStore.getState().threadMessages.slice(0, -1);
      const reply = await continueThread(currentAnalysis, history, message);
      addThreadMessage({ role: 'assistant', text: reply });
    } catch (err) {
      addThreadMessage({
        role: 'assistant',
        text:
          err instanceof Error
            ? `Sorry, may problema: ${err.message}`
            : 'Sorry, something went wrong. Please try again.',
      });
    } finally {
      setThreadBusy(false);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={threadMessages}
        keyExtractor={(_, i) => String(i)}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListHeaderComponent={
          <View style={styles.contextCard}>
            <Text style={styles.contextTitle}>Talking about:</Text>
            <Text style={styles.contextSummary}>{currentAnalysis.summary}</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsLabel}>Try asking:</Text>
            {SUGGESTIONS.map((s) => (
              <Pressable key={s} style={styles.suggestion} onPress={() => void send(s)}>
                <Text style={styles.suggestionText}>{s}</Text>
              </Pressable>
            ))}
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}
          >
            <Text style={item.role === 'user' ? styles.userText : styles.aiText}>{item.text}</Text>
          </View>
        )}
        ListFooterComponent={
          isThreadBusy ? (
            <View style={[styles.bubble, styles.aiBubble, styles.typing]}>
              <ActivityIndicator size="small" color="#93C5FD" />
            </View>
          ) : null
        }
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Ask anything about this message…"
          placeholderTextColor="#475569"
          value={draft}
          onChangeText={setDraft}
          multiline
          editable={!isThreadBusy}
        />
        <Pressable
          style={[styles.sendButton, (isThreadBusy || !draft.trim()) && styles.sendDisabled]}
          onPress={() => void send(draft)}
          disabled={isThreadBusy || !draft.trim()}
        >
          <Text style={styles.sendLabel}>↑</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#020617' },
  emptyWrap: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: { color: '#94A3B8', fontSize: 14, textAlign: 'center', lineHeight: 21 },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 8 },
  contextCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  contextTitle: { color: '#64748B', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  contextSummary: { color: '#CBD5E1', fontSize: 13, marginTop: 4, lineHeight: 18 },
  suggestions: { marginTop: 8 },
  suggestionsLabel: { color: '#64748B', fontSize: 13, marginBottom: 8 },
  suggestion: {
    backgroundColor: '#0F172A',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  suggestionText: { color: '#93C5FD', fontSize: 13 },
  bubble: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    maxWidth: '85%',
  },
  userBubble: { backgroundColor: '#2563EB', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: '#1E293B', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  userText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  aiText: { color: '#E2E8F0', fontSize: 14, lineHeight: 20 },
  typing: { paddingHorizontal: 20 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    backgroundColor: '#020617',
  },
  input: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#E2E8F0',
    fontSize: 14,
    maxHeight: 120,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.4 },
  sendLabel: { color: '#fff', fontSize: 20, fontWeight: '800' },
});
