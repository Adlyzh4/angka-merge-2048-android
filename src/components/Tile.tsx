// src/components/Tile.tsx
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getTileColor } from '../constants/gameConfig';

interface TileProps {
  value: number;
}

function TileComponent({ value }: TileProps) {
  const { bg, text } = getTileColor(value);
  const fontSize = value >= 1000 ? 22 : value >= 100 ? 26 : 32;

  return (
    <View style={[styles.tile, { backgroundColor: bg }]}>
      {value !== 0 && (
        <Text style={[styles.tileText, { color: text, fontSize }]}>{value}</Text>
      )}
    </View>
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