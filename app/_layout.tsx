import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#020617' },
          headerTintColor: '#F8FAFC',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#020617' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'ScamShield PH' }} />
        <Stack.Screen name="result" options={{ title: 'Analysis' }} />
        <Stack.Screen name="trajectory" options={{ title: 'What Happens Next' }} />
        <Stack.Screen name="recovery" options={{ title: 'Recovery & Reporting' }} />
        <Stack.Screen name="thread" options={{ title: 'Ask ScamShield' }} />
        <Stack.Screen name="learn" options={{ title: 'Learn About Scams' }} />
      </Stack>
    </>
  );
}
