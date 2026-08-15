// App.tsx
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Board } from '../src/components/Board';
import { useGameState } from '../src/hooks/useGameState';
import { useHighScore } from '../src/hooks/useHighScore';
import { initSounds, playMergeSound, playGameOverSound } from '../src/services/sound';
import { getTheme } from '../src/theme/colors';
import { router } from 'expo-router';


export default function GameScreen() {
  const { state, swipe, restart, continueAfterWin } = useGameState();
  const { userData, isLoaded, updateAfterGame, toggleSound, toggleDarkMode } = useHighScore();
  const prevScoreRef = useRef(0);
  const theme = getTheme(userData.settings.darkMode);

  useEffect(() => {
    initSounds();
  }, []);

  // Play sound effect saat skor nambah (artinya ada merge)
  useEffect(() => {
    if (state.score > prevScoreRef.current) {
      playMergeSound(userData.settings.soundEnabled);
    }
    prevScoreRef.current = state.score;
  }, [state.score, userData.settings.soundEnabled]);

  // Simpan high score & mainkan sound saat game over
  useEffect(() => {
    if (state.status === 'gameover') {
      playGameOverSound(userData.settings.soundEnabled);
      updateAfterGame(state.score, state.bestTile);
    }
  }, [state.status]);

  if (!isLoaded) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textPrimary }}>Memuat...</Text>
      </SafeAreaView>
    );
  }

  function handleRestartPress() {
    if (state.moveCount === 0) {
      // Kalau belum ada langkah, langsung restart tanpa nanya (belum ada progress yang hilang)
      restart();
      return;
    }
    Alert.alert(
      'Restart Permainan?',
      'Progress permainan saat ini akan hilang.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Restart', style: 'destructive', onPress: restart },
      ]
    );
  }

  function handleBackPress() {
    if (state.moveCount === 0 || state.status !== 'playing') {
      // Belum ada progress berarti, atau game udah selesai -> langsung keluar tanpa nanya
      router.back();
      return;
    }
    Alert.alert(
      'Keluar dari Permainan?',
      'Progress permainan saat ini akan hilang jika keluar ke menu.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: () => router.back() },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={handleBackPress}>
          <Text style={[styles.backButton, { color: theme.textPrimary }]}>← Menu</Text>
        </Pressable>
      </View>

      <View style={styles.scoreRow}>
        <View style={[styles.scoreBox, { backgroundColor: theme.boardBackground }]}>
          <Text style={styles.scoreLabel}>SKOR</Text>
          <Text style={styles.scoreValue}>{state.score}</Text>
        </View>
        <View style={[styles.scoreBox, { backgroundColor: theme.boardBackground }]}>
          <Text style={styles.scoreLabel}>TERBAIK</Text>
          <Text style={styles.scoreValue}>{userData.highScore}</Text>
        </View>
        <Pressable
          style={[styles.restartButton, { backgroundColor: theme.buttonBackground }]}
          onPress={handleRestartPress}
        >
          <Text style={styles.restartText}>Restart</Text>
        </Pressable>
      </View>

      <Board tiles={state.tiles} onSwipe={swipe} />

      <View style={styles.settingsRow}>
        <View style={styles.settingItem}>
          <Text style={{ color: theme.textPrimary }}>Suara</Text>
          <Switch value={userData.settings.soundEnabled} onValueChange={toggleSound} />
        </View>
        <View style={styles.settingItem}>
          <Text style={{ color: theme.textPrimary }}>Mode Gelap</Text>
          <Switch value={userData.settings.darkMode} onValueChange={toggleDarkMode} />
        </View>
      </View>

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
          <Text style={styles.overlaySubtext}>Skor: {state.score}</Text>
          <Pressable style={styles.overlayButton} onPress={restart}>
            <Text style={styles.overlayButtonText}>Main Lagi</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  scoreBox: { borderRadius: 6, paddingVertical: 8, paddingHorizontal: 14, alignItems: 'center' },
  scoreLabel: { color: '#EEE4DA', fontSize: 11, fontWeight: 'bold' },
  scoreValue: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  restartButton: { borderRadius: 6, paddingVertical: 10, paddingHorizontal: 14 },
  restartText: { color: '#FFFFFF', fontWeight: 'bold' },
  settingsRow: { flexDirection: 'row', gap: 24, marginTop: 24 },
  settingItem: { alignItems: 'center', gap: 4 },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(238, 228, 218, 0.9)',
    justifyContent: 'center', alignItems: 'center',
  },
  overlayText: { fontSize: 32, fontWeight: 'bold', color: '#776E65', marginBottom: 8 },
  overlaySubtext: { fontSize: 18, color: '#776E65', marginBottom: 20 },
  overlayButton: { backgroundColor: '#8F7A66', borderRadius: 6, paddingVertical: 12, paddingHorizontal: 24 },
  overlayButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  headerRow: { width: '100%', paddingHorizontal: 20, marginBottom: 8 },
  backButton: { fontSize: 16, fontWeight: 'bold' },
});