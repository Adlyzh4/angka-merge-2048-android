// src/components/Tile.tsx
import React, { memo, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { getTileColor, TILE_GAP } from '../constants/gameConfig';

interface TileProps {
  value: number;
  row: number;
  col: number;
  cellSize: number;
  isNew?: boolean;
  isMerged?: boolean;
  reduceMotion?: boolean; // optional prop to control animation
}

function TileComponent({ value, row, col, cellSize, isNew, isMerged, reduceMotion }: TileProps) {
  const { bg, text } = getTileColor(value);
  const fontSize = value >= 1000 ? 22 : value >= 100 ? 26 : 32;

  const translateX = useSharedValue(col * cellSize);
  const translateY = useSharedValue(row * cellSize);
  const scale = useSharedValue(isNew ? 0.3 : 1);

  // Animasi GESER — jalan tiap kali posisi row/col berubah
  useEffect(() => {
    if (reduceMotion) {
      translateX.value = col * cellSize;
      translateY.value = row * cellSize;
    } else {
      translateX.value = withTiming(col * cellSize, { duration: 120 });
      translateY.value = withTiming(row * cellSize, { duration: 120 });
    }
  }, [row, col, reduceMotion]);

  // Animasi MUNCUL (tile baru) atau BOUNCE (habis merge)
  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1;
      return;
    }
    if (isNew) {
      scale.value = 0.3;
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    } else if (isMerged) {
      scale.value = withSequence(withTiming(1.15, { duration: 90 }), withTiming(1, { duration: 90 }));
    }
  }, [isNew, isMerged, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    left: translateX.value + TILE_GAP / 2,
    top: translateY.value + TILE_GAP / 2,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[styles.tile, { backgroundColor: bg, width: cellSize - TILE_GAP, height: cellSize - TILE_GAP }, animatedStyle]}
    >
      <Text style={[styles.tileText, { color: text, fontSize }]}>{value}</Text>
    </Animated.View>
  );
}

export const Tile = memo(TileComponent);

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileText: { fontWeight: 'bold' },
});