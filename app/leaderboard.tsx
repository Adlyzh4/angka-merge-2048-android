// app/leaderboard.tsx
import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useHighScore } from '../src/hooks/useHighScore';
import { getTheme } from '../src/theme/colors';
import { generateLeaderboard, LeaderboardEntry } from '../src/game-logic/leaderboardData';
import { playClickSound } from '../src/services/sound';
import { BannerAdView } from '../src/components/BannerAdView';


const MEDALS = ['🥇', '🥈', '🥉'];

function LeaderboardRow({
  entry,
  rank,
  boardColor,
  textColor,
}: {
  entry: LeaderboardEntry;
  rank: number;
  boardColor: string;
  textColor: string;
}) {
  const medal = MEDALS[rank - 1];

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: entry.isUser ? '#8F7A66' : boardColor },
        entry.isUser && styles.userRow,
      ]}
    >
      <View style={styles.rankContainer}>
        {medal ? (
          <Text style={styles.medalText}>{medal}</Text>
        ) : (
          <Text style={styles.rankText}>{rank}</Text>
        )}
      </View>
      <Text style={[styles.nameText, entry.isUser && styles.userNameText]} numberOfLines={1}>
        {entry.name}
      </Text>
      <Text style={[styles.scoreText, entry.isUser && styles.userNameText]}>{entry.score}</Text>
    </View>
  );
}

export default function LeaderboardScreen() {
  const { userData, isLoaded, reload } = useHighScore();
  const theme = getTheme(userData.settings.darkMode);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  if (!isLoaded) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textPrimary }}>Memuat...</Text>
      </SafeAreaView>
    );
  }

  const leaderboard = generateLeaderboard(userData.highScore);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => {
          playClickSound(userData.settings.soundEnabled);
          router.back();
        }}>
          <Text style={[styles.backButton, { color: theme.textPrimary }]}> Menu</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Papan Skor</Text>
        <View style={{ width: 50 }} />
      </View>

      {userData.highScore === 0 && (
        <Text style={[styles.hint, { color: theme.textPrimary }]}>
          Kamu belum punya skor. Main dulu yuk untuk masuk papan skor!
        </Text>
      )}

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <LeaderboardRow
            entry={item}
            rank={index + 1}
            boardColor={theme.boardBackground}
            textColor={theme.textPrimary}
          />
        )}
      />
      <BannerAdView/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backButton: { fontSize: 16, fontWeight: 'bold', width: 50 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  hint: { fontSize: 13, opacity: 0.7, textAlign: 'center', marginBottom: 12 },
  listContent: { paddingBottom: 40, gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  userRow: { borderWidth: 2, borderColor: '#EDC22E' },
  rankContainer: { width: 36, alignItems: 'center' },
  medalText: { fontSize: 20 },
  rankText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', opacity: 0.85 },
  nameText: { flex: 1, color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginLeft: 8 },
  userNameText: { fontWeight: 'bold' },
  scoreText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});