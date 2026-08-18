// app/game.tsx
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Board } from '../src/components/Board';
import { useGameState } from '../src/hooks/useGameState';
import { useHighScore } from '../src/hooks/useHighScore';
import { playMergeSound, playGameOverSound, playClickSound, initSounds } from '../src/services/sound';
import { getTheme } from '../src/theme/colors';
import { loadGameProgress, saveGameProgress, clearGameProgress, SavedGameData, getCachedUserData } from '../src/services/storage';

export default function GameScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  // Kalau bukan mode 'resume', kita nggak perlu nunggu apapun jadi langsung null dari awal (no flash sama sekali)
  const [savedData, setSavedData] = useState<SavedGameData | null | undefined>(
    mode === 'resume' ? undefined : null
  );

  useEffect(() => {
    if (mode === 'resume') {
      loadGameProgress().then(setSavedData);
    }
  }, [mode]);

  if (savedData === undefined) {
    const cached = getCachedUserData();
    const bgColor = cached?.settings.darkMode ? '#1A1A1A' : '#FAF8EF';
    return <View style={{ flex: 1, backgroundColor: bgColor }} />;
  }

  return <GameScreenInner initialData={savedData} />;
}

function GameScreenInner({ initialData }: { initialData: SavedGameData | null }) {
  const { state, swipe, restart, continueAfterWin, undo, addUndos, canUndo } = useGameState(initialData);
  const { userData, isLoaded, updateAfterGame } = useHighScore();
  const prevScoreRef = useRef(state.score);
  const theme = getTheme(userData.settings.darkMode);

  useEffect(() => {
    if (state.score > prevScoreRef.current) {
      playMergeSound(userData.settings.soundEnabled);
    }
    prevScoreRef.current = state.score;
  }, [state.score, userData.settings.soundEnabled]);

  useEffect(() => {
    if (state.status === 'gameover') {
      playGameOverSound(userData.settings.soundEnabled);
      updateAfterGame(state.score, state.bestTile);
    }
  }, [state.status]);

  // Simpan/hapus progress otomatis tiap ada perubahan
  useEffect(() => {
    if (state.status === 'gameover' || state.moveCount === 0) {
      clearGameProgress();
      return;
    }
    saveGameProgress({
      tiles: state.tiles,
      score: state.score,
      bestTile: state.bestTile,
      moveCount: state.moveCount,
      undoCount: state.undoCount,
    });
  }, [state.tiles, state.score, state.moveCount, state.status, state.undoCount]);

  function handleRestartPress() {
    playClickSound(userData.settings.soundEnabled);
    if (state.moveCount === 0) {
      restart();
      return;
    }
    Alert.alert('Restart Permainan?', 'Progress permainan saat ini akan hilang.', [
      { text: 'Batal', style: 'cancel', onPress: () => { playClickSound(userData.settings.soundEnabled); } },
      { text: 'Restart', style: 'destructive', onPress: () => { playClickSound(userData.settings.soundEnabled); restart(); } },
    ]);
  }

  function handleUndoPress() {
    playClickSound(userData.settings.soundEnabled);

    if (state.undoCount <= 0) {
      Alert.alert(
        'Undo Habis',
        'Kamu sudah menggunakan semua jatah undo. Fitur nonton iklan untuk menambah undo akan segera hadir!'
      );
      return;
    }

    if (!canUndo) {
      return; // belum ada gerakan yang bisa di-undo
    }

    undo();
  }

  if (!isLoaded) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textPrimary }}>Memuat...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => {
          playClickSound(userData.settings.soundEnabled);
          router.back();
        }}>
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
          style={[
            styles.undoButton,
            { backgroundColor: theme.boardBackground, opacity: canUndo ? 1 : 0.5 },
          ]}
          onPress={handleUndoPress}
        >
          <Text style={styles.undoText}>↩️ {state.undoCount}</Text>
        </Pressable>
        <Pressable
          style={[styles.restartButton, { backgroundColor: theme.buttonBackground }]}
          onPress={handleRestartPress}
        >
          <Text style={styles.restartText}>Restart</Text>
        </Pressable>
      </View>

      <Board tiles={state.tiles} onSwipe={swipe} reduceMotion={userData.settings.reduceMotion} />

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
  headerRow: { width: '100%', paddingHorizontal: 20, marginBottom: 8 },
  backButton: { fontSize: 16, fontWeight: 'bold' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  scoreBox: { borderRadius: 6, paddingVertical: 8, paddingHorizontal: 14, alignItems: 'center' },
  scoreLabel: { color: '#EEE4DA', fontSize: 11, fontWeight: 'bold' },
  scoreValue: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  restartButton: { borderRadius: 6, paddingVertical: 10, paddingHorizontal: 14 },
  restartText: { color: '#FFFFFF', fontWeight: 'bold' },
  undoButton: { borderRadius: 6, paddingVertical: 10, paddingHorizontal: 14 },
  undoText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(238, 228, 218, 0.9)',
    justifyContent: 'center', alignItems: 'center',
  },
  overlayText: { fontSize: 32, fontWeight: 'bold', color: '#776E65', marginBottom: 8 },
  overlaySubtext: { fontSize: 18, color: '#776E65', marginBottom: 20 },
  overlayButton: { backgroundColor: '#8F7A66', borderRadius: 6, paddingVertical: 12, paddingHorizontal: 24 },
  overlayButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});