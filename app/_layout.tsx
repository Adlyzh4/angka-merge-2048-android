// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initSounds } from '../src/services/sound';
import { useHighScore } from '../src/hooks/useHighScore';
import { getTheme } from '../src/theme/colors';
import mobileAds from 'react-native-google-mobile-ads';

export default function RootLayout() {
  const { userData } = useHighScore();
  const theme = getTheme(userData.settings.darkMode);

  useEffect(() => {
    initSounds();
  }, []);

  useEffect(() => {
    mobileAds()
        .initialize()
        .then(() => {
        console.log('AdMob SDK initialized');
        });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 200,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
    </GestureHandlerRootView>
  );
}