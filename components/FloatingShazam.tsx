import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  onPress: () => void;
  busy?: boolean;
}

/**
 * The big Shazam-style analyze button: a pulsing shield the user taps right
 * after screenshotting a suspicious message.
 */
export function FloatingShazam({ onPress, busy = false }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.55] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] });

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[styles.ring, { transform: [{ scale: ringScale }], opacity: ringOpacity }]}
      />
      <Pressable
        onPress={onPress}
        disabled={busy}
        style={({ pressed }) => [styles.button, pressed && styles.pressed, busy && styles.busy]}
        accessibilityRole="button"
        accessibilityLabel="Check a screenshot for scams"
      >
        <Text style={styles.icon}>🛡️</Text>
        <Text style={styles.label}>{busy ? 'Checking…' : 'Check Screenshot'}</Text>
      </Pressable>
    </View>
  );
}

const SIZE = 180;

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE * 1.4,
  },
  ring: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#2563EB',
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  pressed: { backgroundColor: '#1D4ED8', transform: [{ scale: 0.97 }] },
  busy: { opacity: 0.7 },
  icon: { fontSize: 52, marginBottom: 6 },
  label: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
