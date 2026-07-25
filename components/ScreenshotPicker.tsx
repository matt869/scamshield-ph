import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getLatestScreenshot } from '../services/platform/iosScreenshot';
import { markScreenshotSeen } from '../services/platform/screenReader';

interface Props {
  visible: boolean;
  onClose: () => void;
  /** base64 is provided when the source can supply it directly */
  onPicked: (uri: string, base64?: string) => void;
}

/**
 * Bottom-sheet chooser for the two screenshot sources: the most recent
 * screenshot (one tap) or the photo gallery.
 */
export function ScreenshotPicker({ visible, onClose, onPicked }: Props) {
  const [loading, setLoading] = useState<null | 'latest' | 'gallery'>(null);

  const pickLatest = async () => {
    setLoading('latest');
    try {
      const shot = await getLatestScreenshot();
      if (!shot) {
        Alert.alert(
          'No screenshot found',
          'Take a screenshot of the suspicious message first, or allow photo access in Settings.'
        );
        return;
      }
      markScreenshotSeen(shot.assetId);
      onClose();
      onPicked(shot.uri);
    } finally {
      setLoading(null);
    }
  };

  const pickFromGallery = async () => {
    setLoading('gallery');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        base64: true,
      });
      const asset = result.assets?.[0];
      if (result.canceled || !asset) return;
      onClose();
      onPicked(asset.uri, asset.base64 ?? undefined);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => undefined}>
          <View style={styles.handle} />
          <Text style={styles.title}>Analyze a screenshot</Text>

          <Pressable style={styles.option} onPress={pickLatest} disabled={loading !== null}>
            {loading === 'latest' ? (
              <ActivityIndicator color="#93C5FD" />
            ) : (
              <Text style={styles.optionIcon}>⚡</Text>
            )}
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Use my latest screenshot</Text>
              <Text style={styles.optionHint}>The one you just took</Text>
            </View>
          </Pressable>

          <Pressable style={styles.option} onPress={pickFromGallery} disabled={loading !== null}>
            {loading === 'gallery' ? (
              <ActivityIndicator color="#93C5FD" />
            ) : (
              <Text style={styles.optionIcon}>🖼️</Text>
            )}
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Choose from gallery</Text>
              <Text style={styles.optionHint}>Pick any saved screenshot</Text>
            </View>
          </Pressable>

          <Pressable style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
    marginBottom: 14,
  },
  title: { color: '#F8FAFC', fontSize: 17, fontWeight: '700', marginBottom: 14 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  optionIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  optionTextWrap: { marginLeft: 12, flex: 1 },
  optionTitle: { color: '#E2E8F0', fontSize: 15, fontWeight: '600' },
  optionHint: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  cancel: { alignItems: 'center', paddingVertical: 12, marginTop: 4 },
  cancelText: { color: '#94A3B8', fontSize: 15 },
});
