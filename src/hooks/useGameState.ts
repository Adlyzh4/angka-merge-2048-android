// src/hooks/useGameState.ts
import { useReducer, useCallback } from 'react';
import {
  Grid,
  Direction,
  initializeGame,
  moveGrid,
  spawnRandomTile,
  hasValidMoves,
  hasTileValue,
} from '../game-logic/grid';

type Status = 'playing' | 'won' | 'gameover';

interface GameState {
  grid: Grid;
  score: number;
  bestTile: number;
  status: Status;
  moveCount: number;
}

type GameAction =
  | { type: 'SWIPE'; direction: Direction }
  | { type: 'RESTART' }
  | { type: 'CONTINUE_AFTER_WIN' };

function getBestTile(grid: Grid): number {
  return Math.max(...grid.flat());
}

function createInitialState(): GameState {
  const grid = initializeGame();
  return {
    grid,
    score: 0,
    bestTile: getBestTile(grid),
    status: 'playing',
    moveCount: 0,
  };
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SWIPE': {
      if (state.status === 'gameover') return state;

      const { grid: movedGrid, scoreGained, moved } = moveGrid(state.grid, action.direction);
      if (!moved) return state; // swipe nggak menghasilkan perubahan, abaikan

      const newGrid = spawnRandomTile(movedGrid);
      const newScore = state.score + scoreGained;
      const newBestTile = getBestTile(newGrid);

      let newStatus: Status = state.status;
      if (state.status === 'playing' && hasTileValue(newGrid, 2048)) {
        newStatus = 'won';
      } else if (!hasValidMoves(newGrid)) {
        newStatus = 'gameover';
      }

      return {
        grid: newGrid,
        score: newScore,
        bestTile: newBestTile,
        status: newStatus,
        moveCount: state.moveCount + 1,
      };
    }
    case 'CONTINUE_AFTER_WIN': {
      return { ...state, status: 'playing' };
    }
    case 'RESTART': {
      return createInitialState();
    }
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const swipe = useCallback((direction: Direction) => {
    dispatch({ type: 'SWIPE', direction });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const continueAfterWin = useCallback(() => {
    dispatch({ type: 'CONTINUE_AFTER_WIN' });
  }, []);

  return { state, swipe, restart, continueAfterWin };
}