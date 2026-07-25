import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ACTION_GUIDES, NATIONAL_HOTLINES, guidesForCategory } from '../constants/actionGuides';
import { useAppStore } from '../store/useAppStore';

function tryDial(contact: string) {
  const phone = contact.match(/(?:\+?63|0|\()[\d\s()-]{6,}/)?.[0]?.replace(/[^\d+]/g, '');
  if (phone && phone.length >= 4) {
    void Linking.openURL(`tel:${phone}`);
  }
}

export default function RecoveryScreen() {
  const analysis = useAppStore((s) => s.currentAnalysis);
  const guides = analysis ? guidesForCategory(analysis.categoryId) : ACTION_GUIDES;
  const [openId, setOpenId] = useState<string | null>(guides[0]?.id ?? null);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        Kung nabudol ka o nag-reply ka na — huwag mahiya, hindi ka nag-iisa. Follow the steps that
        match your situation, then report it so others don't fall for the same scam.
      </Text>

      {guides.map((guide) => {
        const open = openId === guide.id;
        return (
          <View key={guide.id} style={styles.card}>
            <Pressable style={styles.cardHeader} onPress={() => setOpenId(open ? null : guide.id)}>
              <Text style={styles.cardTitle}>{guide.title}</Text>
              <Text style={styles.chevron}>{open ? '▾' : '▸'}</Text>
            </Pressable>
            {open && (
              <View style={styles.cardBody}>
                {guide.steps.map((step, i) => (
                  <View key={i} style={styles.stepRow}>
                    <Text style={styles.stepNumber}>{i + 1}</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}

      <Text style={styles.hotlinesHeader}>📞 Where to report</Text>
      {NATIONAL_HOTLINES.map((hotline) => (
        <Pressable
          key={hotline.name}
          style={styles.hotline}
          onPress={() => tryDial(hotline.contact)}
        >
          <Text style={styles.hotlineName}>{hotline.name}</Text>
          <Text style={styles.hotlineContact}>{hotline.contact}</Text>
          {hotline.note ? <Text style={styles.hotlineNote}>{hotline.note}</Text> : null}
        </Pressable>
      ))}

      <Text style={styles.disclaimer}>
        Hotlines change — verify on each agency's official website before relying on a number.
        Tapping a card attempts to dial when a phone number is present.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 20, paddingBottom: 48 },
  intro: { color: '#94A3B8', fontSize: 14, lineHeight: 21, marginBottom: 18 },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '700', flex: 1, marginRight: 8 },
  chevron: { color: '#64748B', fontSize: 16 },
  cardBody: { paddingHorizontal: 16, paddingBottom: 16 },
  stepRow: { flexDirection: 'row', marginBottom: 8 },
  stepNumber: {
    color: '#93C5FD',
    fontWeight: '800',
    width: 22,
    fontSize: 13,
  },
  stepText: { color: '#CBD5E1', fontSize: 13, lineHeight: 19, flex: 1 },
  hotlinesHeader: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  hotline: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  hotlineName: { color: '#E2E8F0', fontWeight: '700', fontSize: 14 },
  hotlineContact: { color: '#93C5FD', fontSize: 13, marginTop: 3 },
  hotlineNote: { color: '#64748B', fontSize: 12, marginTop: 3, lineHeight: 17 },
  disclaimer: { color: '#475569', fontSize: 11, lineHeight: 16, marginTop: 14 },
});
