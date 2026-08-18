// app/index.tsx
import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, BackHandler, ImageBackground } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useHighScore } from '../src/hooks/useHighScore';
import { menuTheme } from '../src/theme/colors';
import { loadGameProgress } from '../src/services/storage';
import { playClickSound } from '../src/services/sound';
import { BannerAdView } from '../src/components/BannerAdView';

export default function MenuScreen() {
  const { userData, isLoaded, reload } = useHighScore();
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      reload();
      loadGameProgress().then((data) => setHasSavedGame(!!data));
    }, [reload])
  );

  function handleExit() {
    playClickSound(userData.settings.soundEnabled);
    Alert.alert('Keluar Aplikasi?', 'Kamu yakin mau keluar dari Angka Merge 2048?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: () => BackHandler.exitApp() },
    ]);
  }

  function handleNewGame() {
    playClickSound(userData.settings.soundEnabled);
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

  function navigateWithSound(path: string) {
    playClickSound(userData.settings.soundEnabled);
    router.push(path as any);
  }

  if (!isLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: menuTheme.secondaryButton }]}>
        <Text style={{ color: menuTheme.textPrimary }}>Memuat...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/images/menu-bg.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Angka Merge 2048</Text>
          <Text style={styles.subtitle}>Skor Terbaik: {userData.highScore}</Text>
        </View>

        <View style={styles.menuList}>
          {hasSavedGame ? (
            <>
              <Pressable
                style={[styles.menuButton, styles.primaryButton]}
                onPress={() => {
                  playClickSound(userData.settings.soundEnabled);
                  router.push({ pathname: '/game', params: { mode: 'resume' } });
                }}
              >
                <Text style={styles.primaryButtonText}>Lanjutkan</Text>
              </Pressable>
              <Pressable style={[styles.menuButton, styles.secondaryButton]} onPress={handleNewGame}>
                <Text style={styles.secondaryButtonText}>Main Baru</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={[styles.menuButton, styles.primaryButton]} onPress={handleNewGame}>
              <Text style={styles.primaryButtonText}>Main</Text>
            </Pressable>
          )}

          <Pressable
            style={[styles.menuButton, styles.secondaryButton]}
            onPress={() => navigateWithSound('/leaderboard')}
          >
            <Text style={styles.secondaryButtonText}>Papan Skor</Text>
          </Pressable>

          <Pressable
            style={[styles.menuButton, styles.secondaryButton]}
            onPress={() => navigateWithSound('/how-to-play')}
          >
            <Text style={styles.secondaryButtonText}>Cara Main</Text>
          </Pressable>

          <Pressable
            style={[styles.menuButton, styles.secondaryButton]}
            onPress={() => navigateWithSound('/settings')}
          >
            <Text style={styles.secondaryButtonText}>Pengaturan</Text>
          </Pressable>

          <Pressable style={[styles.menuButton, styles.exitButton]} onPress={handleExit}>
            <Text style={styles.exitButtonText}>Keluar</Text>
          </Pressable>
        </View>

        <View style={[styles.bannerWrap, { bottom: insets.bottom + 12 }]}>
            <BannerAdView />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  titleWrap: { alignItems: 'center', marginBottom: 40 },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(122, 62, 29, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 6,
    opacity: 0.95,
    textShadowColor: 'rgba(122, 62, 29, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  menuList: { width: '100%', gap: 12 },
  menuButton: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#7A3E1D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButton: { backgroundColor: '#FF8A3D' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: '#FFFBF3' },
  secondaryButtonText: { color: '#E8703C', fontSize: 16, fontWeight: '700' },
  exitButton: {
    backgroundColor: 'rgba(255, 251, 243, 0.6)',
    borderWidth: 1.5,
    borderColor: '#B0413E',
    marginTop: 6,
    shadowOpacity: 0,
    elevation: 0,
  },
  exitButtonText: { color: '#B0413E', fontSize: 16, fontWeight: '600' },
  bannerWrap: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
});