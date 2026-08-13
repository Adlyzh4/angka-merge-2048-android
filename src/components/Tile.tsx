// src/components/Tile.tsx
import React, { memo, useEffect, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { getTileColor } from '../constants/gameConfig';

interface TileProps {
  value: number;
}

function TileComponent({ value }: TileProps) {
  const { bg, text } = getTileColor(value);
  const fontSize = value >= 1000 ? 22 : value >= 100 ? 26 : 32;
  const scale = useSharedValue(1);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === 0 && value !== 0) {
      // 1. TILE BARU MUNCUL: Dibuat lebih halus & tidak terlalu membal
      scale.value = 0.5; // Mulai dari 0.5 (tidak terlalu kecil dari awal)
      scale.value = withSpring(1, { 
        damping: 18,     // Dinaikkan (default ~10) -> mengurangi efek membal/vibrasi
        stiffness: 150,  // Diturunkan (default ~100) -> membuat gerakan lebih lambat & smooth
      });
    } else if (prevValue.current !== value && value !== 0) {
      // 2. TILE MERGE: Ukuran maksimal diturunkan dan durasi diperlembut
      scale.value = withSequence(
        withTiming(1.15, { duration: 120 }), // Diturunkan dari 1.15 ke 1.08 agar tidak terlalu besar
        withTiming(1, { duration: 120 })    // Durasi dinaikkan dari 90 ke 120ms agar transisi halus
      );
    }
    prevValue.current = value;
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.tile, { backgroundColor: bg }, animatedStyle]}>
      {value !== 0 && (
        <Text style={[styles.tileText, { color: text, fontSize }]}>{value}</Text>
      )}
    </Animated.View>
  );
}

export const Tile = memo(TileComponent);

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  tileText: {
    fontWeight: 'bold',
  },
});