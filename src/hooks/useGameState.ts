// src/hooks/useGameState.ts
import { useReducer, useCallback } from 'react';
import { hasValidMoves, hasTileValue } from '../game-logic/grid';
import {
  TileEntity,
  Direction,
  initTiles,
  moveTiles,
  spawnTileEntity,
  tilesToGrid,
} from '../game-logic/tileEngine';

type Status = 'playing' | 'won' | 'gameover';

interface GameState {
  tiles: TileEntity[];
  score: number;
  bestTile: number;
  status: Status;
  moveCount: number;
}

type GameAction =
  | { type: 'SWIPE'; direction: Direction }
  | { type: 'RESTART' }
  | { type: 'CONTINUE_AFTER_WIN' };

function getBestTile(tiles: TileEntity[]): number {
  return tiles.reduce((max, t) => Math.max(max, t.value), 0);
}

function createInitialState(): GameState {
  const tiles = initTiles();
  return { tiles, score: 0, bestTile: getBestTile(tiles), status: 'playing', moveCount: 0 };
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SWIPE': {
      if (state.status === 'gameover') return state;

      const { tiles: movedTiles, scoreGained, moved } = moveTiles(state.tiles, action.direction);
      if (!moved) return state;

      const newTiles = spawnTileEntity(movedTiles);
      const grid = tilesToGrid(newTiles);
      const newScore = state.score + scoreGained;
      const newBestTile = getBestTile(newTiles);

      let newStatus: Status = state.status;
      if (state.status === 'playing' && hasTileValue(grid, 2048)) {
        newStatus = 'won';
      } else if (!hasValidMoves(grid)) {
        newStatus = 'gameover';
      }

      return {
        tiles: newTiles,
        score: newScore,
        bestTile: newBestTile,
        status: newStatus,
        moveCount: state.moveCount + 1,
      };
    }
    case 'CONTINUE_AFTER_WIN':
      return { ...state, status: 'playing' };
    case 'RESTART':
      return createInitialState();
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const swipe = useCallback((direction: Direction) => dispatch({ type: 'SWIPE', direction }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);
  const continueAfterWin = useCallback(() => dispatch({ type: 'CONTINUE_AFTER_WIN' }), []);

  return { state, swipe, restart, continueAfterWin };
}