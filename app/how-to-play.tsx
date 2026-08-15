// app/how-to-play.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HowToPlayScreen() {
  return (
    <View style={styles.container}>
      <Text>Cara Main (segera hadir)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});