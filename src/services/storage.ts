// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@angka_merge_2048:userdata';

export interface UserData {
  highScore: number;
  bestTile: number;
  totalGamesPlayed: number;
  settings: {
    soundEnabled: boolean;
    darkMode: boolean;
  };
}

export const defaultUserData: UserData = {
  highScore: 0,
  bestTile: 0,
  totalGamesPlayed: 0,
  settings: {
    soundEnabled: true,
    darkMode: false,
  },
};

export async function loadUserData(): Promise<UserData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUserData;
    return { ...defaultUserData, ...JSON.parse(raw) };
  } catch (error) {
    console.error('Gagal load user data:', error);
    return defaultUserData;
  }
}

export async function saveUserData(data: UserData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Gagal simpan user data:', error);
  }
}