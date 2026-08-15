// src/hooks/useHighScore.ts
import { useState, useEffect, useCallback } from 'react';
import { loadUserData, saveUserData, resetUserData, UserData, defaultUserData } from '../services/storage';

export function useHighScore() {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadUserData().then((data) => {
      setUserData(data);
      setIsLoaded(true);
    });
  }, []);

  const updateAfterGame = useCallback(
    (finalScore: number, finalBestTile: number) => {
      setUserData((prev) => {
        const updated: UserData = {
          ...prev,
          highScore: Math.max(prev.highScore, finalScore),
          bestTile: Math.max(prev.bestTile, finalBestTile),
          totalGamesPlayed: prev.totalGamesPlayed + 1,
        };
        saveUserData(updated);
        return updated;
      });
    },
    []
  );

  const toggleSound = useCallback(() => {
    setUserData((prev) => {
      const updated = {
        ...prev,
        settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled },
      };
      saveUserData(updated);
      return updated;
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setUserData((prev) => {
      const updated = {
        ...prev,
        settings: { ...prev.settings, darkMode: !prev.settings.darkMode },
      };
      saveUserData(updated);
      return updated;
    });
  }, []);

  const resetProgress = useCallback(async () => {
  const fresh = await resetUserData();
    setUserData(fresh);
  }, []);

  return { userData, isLoaded, updateAfterGame, toggleSound, toggleDarkMode, resetProgress };
}