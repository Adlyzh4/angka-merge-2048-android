// src/components/Board.tsx
import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { Tile } from './Tile';
import { TileEntity, Direction } from '../game-logic/tileEngine';
import { GRID_SIZE } from '../game-logic/grid';
import { SWIPE_THRESHOLD, BOARD_PADDING, TILE_GAP } from '../constants/gameConfig';

interface BoardProps {
  tiles: TileEntity[];
  onSwipe: (direction: Direction) => void;
}

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 32, 360);
const INNER_SIZE = BOARD_SIZE - BOARD_PADDING * 2;
const CELL_SIZE = INNER_SIZE / GRID_SIZE;

export function Board({ tiles, onSwipe }: BoardProps) {
  const panGesture = Gesture.Pan()
    .minDistance(SWIPE_THRESHOLD)
    .onEnd((event) => {
      'worklet';
      const { translationX, translationY } = event;
      if (Math.abs(translationX) > Math.abs(translationY)) {
        runOnJS(onSwipe)(translationX > 0 ? 'right' : 'left');
      } else {
        runOnJS(onSwipe)(translationY > 0 ? 'down' : 'up');
      }
    });

  const backgroundCells = Array.from({ length: GRID_SIZE * GRID_SIZE });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
        <View style={{ width: INNER_SIZE, height: INNER_SIZE }}>
          {backgroundCells.map((_, idx) => {
            const r = Math.floor(idx / GRID_SIZE);
            const c = idx % GRID_SIZE;
            return (
              <View
                key={idx}
                style={{
                  position: 'absolute',
                  left: c * CELL_SIZE + TILE_GAP / 2,
                  top: r * CELL_SIZE + TILE_GAP / 2,
                  width: CELL_SIZE - TILE_GAP,
                  height: CELL_SIZE - TILE_GAP,
                  borderRadius: 6,
                  backgroundColor: 'rgba(238, 228, 218, 0.35)',
                }}
              />
            );
          })}

          {tiles.map((t) => (
            <Tile
              key={t.id}
              value={t.value}
              row={t.row}
              col={t.col}
              cellSize={CELL_SIZE}
              isNew={t.isNew}
              isMerged={t.isMerged}
            />
          ))}
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  board: { backgroundColor: '#BBADA0', borderRadius: 8, padding: BOARD_PADDING },
});