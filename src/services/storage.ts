// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TileEntity } from '../game-logic/tileEngine';  

const STORAGE_KEY = '@angka_merge_2048:userdata';

export interface UserData {
  highScore: number;
  bestTile: number;
  totalGamesPlayed: number;
  settings: {
    soundEnabled: boolean;
    darkMode: boolean;
    reduceMotion: boolean;
  };
}

export const defaultUserData: UserData = {
  highScore: 0,
  bestTile: 0,
  totalGamesPlayed: 0,
  settings: {
    soundEnabled: true,
    darkMode: false,
    reduceMotion: false,
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

export async function resetUserData(): Promise<UserData> {
  await saveUserData(defaultUserData);
  return defaultUserData;
}


const SAVED_GAME_KEY = '@angka_merge_2048:savedgame';

export interface SavedGameData {
  tiles: TileEntity[];
  score: number;
  bestTile: number;
  moveCount: number;
}

export async function saveGameProgress(data: SavedGameData): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVED_GAME_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Gagal simpan progress game:', error);
  }
}

export async function loadGameProgress(): Promise<SavedGameData | null> {
  try {
    const raw = await AsyncStorage.getItem(SAVED_GAME_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Gagal load progress game:', error);
    return null;
  }
}

export async function clearGameProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SAVED_GAME_KEY);
  } catch (error) {
    console.error('Gagal hapus progress game:', error);
  }
}