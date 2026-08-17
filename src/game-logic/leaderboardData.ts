// src/game-logic/leaderboardData.ts

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  isUser: boolean;
}

const DUMMY_NAMES = ['Budi Santoso', 'Sari Wulandari', 'Andi Pratama', 'Dewi Lestari', 'Rian Saputra'];

// Multiplier tetap (bukan random) supaya urutan leaderboard konsisten tiap dibuka,
// relatif terhadap skor terbaik user.
const DUMMY_MULTIPLIERS = [1.35, 1.15, 0.9, 0.65, 0.4];

const BASE_SCORE_IF_EMPTY = 800; // dipakai kalau user belum pernah main sama sekali

export function generateLeaderboard(userHighScore: number): LeaderboardEntry[] {
  const baseScore = userHighScore > 0 ? userHighScore : BASE_SCORE_IF_EMPTY;

  const dummyEntries: LeaderboardEntry[] = DUMMY_NAMES.map((name, index) => ({
    id: `dummy-${index}`,
    name,
    score: Math.round((baseScore * DUMMY_MULTIPLIERS[index]) / 4) * 4, // dibulatkan ke kelipatan 4, biar realistis kayak skor 2048 asli
    isUser: false,
  }));

  const userEntry: LeaderboardEntry = {
    id: 'user',
    name: 'Kamu',
    score: userHighScore,
    isUser: true,
  };

  const combined = [...dummyEntries, userEntry];
  combined.sort((a, b) => b.score - a.score);

  return combined;
}