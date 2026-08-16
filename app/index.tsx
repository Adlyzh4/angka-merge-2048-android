// app/index.tsx
import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useHighScore } from '../src/hooks/useHighScore';
import { getTheme } from '../src/theme/colors';
import { loadGameProgress } from '../src/services/storage';

export default function MenuScreen() {
  const { userData, isLoaded, reload } = useHighScore();
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const theme = getTheme(userData.settings.darkMode);

  useFocusEffect(
    useCallback(() => {
      reload();
      loadGameProgress().then((data) => setHasSavedGame(!!data));
    }, [reload])
  );

  function handleExit() {
    Alert.alert('Keluar Aplikasi?', 'Kamu yakin mau keluar dari Angka Merge 2048?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: () => BackHandler.exitApp() },
    ]);
  }

  function handleNewGame() {
    if (hasSavedGame) {
      Alert.alert('Mulai Game Baru?', 'Progress permainan yang tersimpan akan hilang.', [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Mulai Baru',
          style: 'destructive',
          onPress: () => router.push({ pathname: '/game', params: { mode: 'new' } }),
        },
      ]);
    } else {
      router.push({ pathname: '/game', params: { mode: 'new' } });
    }
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
      <Text style={[styles.title, { color: theme.textPrimary }]}>Angka Merge 2048</Text>
      <Text style={[styles.subtitle, { color: theme.textPrimary }]}>
        Skor Terbaik: {userData.highScore}
      </Text>

      <View style={styles.menuList}>
        {hasSavedGame ? (
          <>
            <Pressable
              style={[styles.menuButton, styles.primaryButton]}
              onPress={() => router.push({ pathname: '/game', params: { mode: 'resume' } })}
            >
              <Text style={styles.primaryButtonText}>Lanjutkan</Text>
            </Pressable>
            <Pressable
              style={[styles.menuButton, { backgroundColor: theme.boardBackground }]}
              onPress={handleNewGame}
            >
              <Text style={styles.menuButtonText}>Main Baru</Text>
            </Pressable>
          </>
        ) : (
          <Pressable style={[styles.menuButton, styles.primaryButton]} onPress={handleNewGame}>
            <Text style={styles.primaryButtonText}>Main</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.menuButton, { backgroundColor: theme.boardBackground }]}
          onPress={() => router.push('/leaderboard')}
        >
          <Text style={styles.menuButtonText}>Papan Skor</Text>
        </Pressable>

        <Pressable
          style={[styles.menuButton, { backgroundColor: theme.boardBackground }]}
          onPress={() => router.push('/how-to-play')}
        >
          <Text style={styles.menuButtonText}>Cara Main</Text>
        </Pressable>

        <Pressable
          style={[styles.menuButton, { backgroundColor: theme.boardBackground }]}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.menuButtonText}>Pengaturan</Text>
        </Pressable>

        <Pressable style={[styles.menuButton, styles.exitButton]} onPress={handleExit}>
          <Text style={styles.exitButtonText}>Keluar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 14, marginBottom: 32, opacity: 0.8 },
  menuList: { width: '100%', gap: 12 },
  menuButton: { borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  primaryButton: { backgroundColor: '#8F7A66' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  menuButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  exitButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#B0413E', marginTop: 8 },
  exitButtonText: { color: '#B0413E', fontSize: 16, fontWeight: '600' },
});