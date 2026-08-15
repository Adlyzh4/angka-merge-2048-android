// app/index.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Angka Merge 2048</Text>
      <Pressable style={styles.button} onPress={() => router.push('/game')}>
        <Text style={styles.buttonText}>Main</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8EF', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#776E65', marginBottom: 24 },
  button: { backgroundColor: '#8F7A66', borderRadius: 6, paddingVertical: 14, paddingHorizontal: 32 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});