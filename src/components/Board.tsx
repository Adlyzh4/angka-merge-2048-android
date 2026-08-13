// src/components/Board.tsx
import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Tile } from './Tile';
import { Grid, Direction } from '../game-logic/grid';
import { SWIPE_THRESHOLD, BOARD_PADDING } from '../constants/gameConfig';

interface BoardProps {
  grid: Grid;
  onSwipe: (direction: Direction) => void;
}

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 32, 360);

export function Board({ grid, onSwipe }: BoardProps) {
  const panGesture = Gesture.Pan()
    .minDistance(SWIPE_THRESHOLD)
    .onEnd((event) => {
      'worklet';
      const { translationX, translationY } = event;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (translationX > 0) {
          runOnJSWrapper(onSwipe, 'right');
        } else {
          runOnJSWrapper(onSwipe, 'left');
        }
      } else {
        if (translationY > 0) {
          runOnJSWrapper(onSwipe, 'down');
        } else {
          runOnJSWrapper(onSwipe, 'up');
        }
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((value, colIndex) => (
              <Tile key={`${rowIndex}-${colIndex}`} value={value} />
            ))}
          </View>
        ))}
      </View>
    </GestureDetector>
  );
}

// Helper wajib karena worklet (jalan di UI thread) tidak boleh langsung
// panggil fungsi JS biasa tanpa runOnJS
import { runOnJS } from 'react-native-reanimated';
function runOnJSWrapper(fn: (direction: Direction) => void, direction: Direction) {
  'worklet';
  runOnJS(fn)(direction);
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#BBADA0',
    borderRadius: 8,
    padding: BOARD_PADDING,
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
});