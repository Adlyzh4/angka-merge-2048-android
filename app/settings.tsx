// app/settings.tsx
import React from 'react';
import { View, Text, Pressable, Switch, StyleSheet, Alert, Share, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useHighScore } from '../src/hooks/useHighScore';
import { getTheme } from '../src/theme/colors';

// Ganti dengan package name project lo, dipakai buat link rating & share
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.metaunitasdev.angkamerge2048';
const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { userData, isLoaded, toggleSound, toggleDarkMode, resetProgress } = useHighScore();
  const theme = getTheme(userData.settings.darkMode);

  function handleResetProgress() {
    Alert.alert(
      'Reset Semua Progress?',
      'Skor tertinggi dan statistik permainan akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetProgress() },
      ]
    );
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `Yuk main Angka Merge 2048! Game puzzle angka seru, coba deh: ${PLAY_STORE_URL}`,
      });
    } catch (error) {
      console.error('Gagal share:', error);
    }
  }

  function handleRateApp() {
    Linking.openURL(PLAY_STORE_URL).catch(() => {
      Alert.alert('Gagal membuka Play Store', 'Coba lagi nanti.');
    });
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
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: theme.textPrimary }]}>← Menu</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Pengaturan</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Suara</Text>
          <Switch value={userData.settings.soundEnabled} onValueChange={toggleSound} />
        </View>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Mode Gelap</Text>
          <Switch value={userData.settings.darkMode} onValueChange={toggleDarkMode} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Total Main</Text>
          <Text style={[styles.rowValue, { color: theme.textPrimary }]}>{userData.totalGamesPlayed}x</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Tile Terbaik</Text>
          <Text style={[styles.rowValue, { color: theme.textPrimary }]}>{userData.bestTile}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Pressable style={styles.actionRow} onPress={handleRateApp}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>⭐ Beri Rating</Text>
        </Pressable>
        <Pressable style={styles.actionRow} onPress={handleShare}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>📤 Bagikan Game</Text>
        </Pressable>
        <Pressable style={styles.actionRow} onPress={handleResetProgress}>
          <Text style={[styles.rowLabel, { color: '#B0413E' }]}>🗑️ Reset Progress</Text>
        </Pressable>
      </View>

      <Text style={[styles.versionText, { color: theme.textPrimary }]}>Versi {APP_VERSION}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backButton: { fontSize: 16, fontWeight: 'bold', width: 50 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  section: {
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(150, 150, 150, 0.12)',
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150,150,150,0.3)',
  },
  actionRow: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150,150,150,0.3)',
  },
  rowLabel: { fontSize: 15 },
  rowValue: { fontSize: 15, fontWeight: '600' },
  versionText: { textAlign: 'center', opacity: 0.5, fontSize: 12, marginTop: 8 },
});