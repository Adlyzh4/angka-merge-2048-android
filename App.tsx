// App.tsx
import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Board } from './src/components/Board';
import { useGameState } from './src/hooks/useGameState';

export default function App() {
  const { state, swipe, restart, continueAfterWin } = useGameState();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Angka Merge 2048</Text>

        <View style={styles.scoreRow}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>SKOR</Text>
            <Text style={styles.scoreValue}>{state.score}</Text>
          </View>
          <Pressable style={styles.restartButton} onPress={restart}>
            <Text style={styles.restartText}>Restart</Text>
          </Pressable>
        </View>

        <Board grid={state.grid} onSwipe={swipe} />

        {state.status === 'won' && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Kamu Menang! 🎉</Text>
            <Pressable style={styles.overlayButton} onPress={continueAfterWin}>
              <Text style={styles.overlayButtonText}>Lanjut Main</Text>
            </Pressable>
          </View>
        )}

        {state.status === 'gameover' && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Game Over</Text>
            <Pressable style={styles.overlayButton} onPress={restart}>
              <Text style={styles.overlayButtonText}>Main Lagi</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8EF',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#776E65',
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  scoreBox: {
    backgroundColor: '#BBADA0',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  scoreLabel: { color: '#EEE4DA', fontSize: 12, fontWeight: 'bold' },
  scoreValue: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  restartButton: {
    backgroundColor: '#8F7A66',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  restartText: { color: '#FFFFFF', fontWeight: 'bold' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(238, 228, 218, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#776E65',
    marginBottom: 20,
  },
  overlayButton: {
    backgroundColor: '#8F7A66',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  overlayButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});