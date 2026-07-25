import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SCAM_TAXONOMY } from '../constants/scamTaxonomy';

export default function LearnScreen() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={SCAM_TAXONOMY}
      keyExtractor={(c) => c.id}
      ListHeaderComponent={
        <Text style={styles.intro}>
          The {SCAM_TAXONOMY.length} most common scams hitting Filipinos right now. Kilalanin mo
          sila bago ka nila makilala.
        </Text>
      }
      renderItem={({ item }) => {
        const open = openId === item.id;
        return (
          <View style={styles.card}>
            <Pressable style={styles.header} onPress={() => setOpenId(open ? null : item.id)}>
              <View style={styles.headerText}>
                <Text style={styles.label}>{item.label}</Text>
                {item.aliases.length > 0 && (
                  <Text style={styles.aliases}>aka {item.aliases.join(', ')}</Text>
                )}
              </View>
              <Text style={styles.chevron}>{open ? '▾' : '▸'}</Text>
            </Pressable>

            {open && (
              <View style={styles.body}>
                <Text style={styles.description}>{item.description}</Text>

                <Text style={styles.subheading}>Usually arrives via</Text>
                <View style={styles.channels}>
                  {item.channels.map((ch) => (
                    <View key={ch} style={styles.channelChip}>
                      <Text style={styles.channelText}>{ch}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.subheading}>Warning signs</Text>
                {item.warningSigns.map((sign, i) => (
                  <View key={i} style={styles.signRow}>
                    <Text style={styles.signBullet}>🚩</Text>
                    <Text style={styles.signText}>{sign}</Text>
                  </View>
                ))}

                <Text style={styles.subheading}>Example (fabricated)</Text>
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleText}>{item.example}</Text>
                </View>
              </View>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 20, paddingBottom: 48 },
  intro: { color: '#94A3B8', fontSize: 14, lineHeight: 21, marginBottom: 16 },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerText: { flex: 1, marginRight: 8 },
  label: { color: '#F8FAFC', fontSize: 15, fontWeight: '700' },
  aliases: { color: '#64748B', fontSize: 12, marginTop: 2, fontStyle: 'italic' },
  chevron: { color: '#64748B', fontSize: 16 },
  body: { paddingHorizontal: 16, paddingBottom: 16 },
  description: { color: '#CBD5E1', fontSize: 13, lineHeight: 20 },
  subheading: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 14,
    marginBottom: 6,
  },
  channels: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  channelChip: {
    backgroundColor: '#1E293B',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  channelText: { color: '#93C5FD', fontSize: 11 },
  signRow: { flexDirection: 'row', marginBottom: 5 },
  signBullet: { fontSize: 11, width: 22, marginTop: 2 },
  signText: { color: '#CBD5E1', fontSize: 13, lineHeight: 19, flex: 1 },
  exampleBox: {
    backgroundColor: '#020617',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  exampleText: { color: '#94A3B8', fontSize: 13, lineHeight: 19, fontStyle: 'italic' },
});
