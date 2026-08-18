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
import { SavedGameData } from '../services/storage';

type Status = 'playing' | 'won' | 'gameover';

const MAX_UNDO = 5;

interface HistoryEntry {
  tiles: TileEntity[];
  score: number;
  moveCount: number;
}

interface GameState {
  tiles: TileEntity[];
  score: number;
  bestTile: number;
  status: Status;
  moveCount: number;
  history: HistoryEntry[];
  undoCount: number;
}

type GameAction =
  | { type: 'SWIPE'; direction: Direction }
  | { type: 'RESTART' }
  | { type: 'CONTINUE_AFTER_WIN' }
  | { type: 'UNDO' }
  | { type: 'ADD_UNDOS'; amount: number };

function getBestTile(tiles: TileEntity[]): number {
  return tiles.reduce((max, t) => Math.max(max, t.value), 0);
}

function createInitialState(): GameState {
  const tiles = initTiles();
  return {
    tiles,
    score: 0,
    bestTile: getBestTile(tiles),
    status: 'playing',
    moveCount: 0,
    history: [],
    undoCount: MAX_UNDO,
  };
}

function createStateFromSaved(saved: SavedGameData): GameState {
  return {
    tiles: saved.tiles.map((t) => ({ ...t, isNew: false, isMerged: false })),
    score: saved.score,
    bestTile: saved.bestTile,
    status: 'playing',
    moveCount: saved.moveCount,
    history: [], // riwayat tidak dipersist, mulai kosong tiap resume
    undoCount: saved.undoCount ?? MAX_UNDO,
  };
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

      const newHistory = [
        ...state.history,
        { tiles: state.tiles, score: state.score, moveCount: state.moveCount },
      ].slice(-MAX_UNDO);

      return {
        tiles: newTiles,
        score: newScore,
        bestTile: newBestTile,
        status: newStatus,
        moveCount: state.moveCount + 1,
        history: newHistory,
        undoCount: state.undoCount,
      };
    }
    case 'UNDO': {
      if (state.undoCount <= 0 || state.history.length === 0) return state;

      const previous = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);

      return {
        tiles: previous.tiles,
        score: previous.score,
        bestTile: getBestTile(previous.tiles),
        status: 'playing',
        moveCount: previous.moveCount,
        history: newHistory,
        undoCount: state.undoCount - 1,
      };
    }
    case 'ADD_UNDOS':
      return { ...state, undoCount: state.undoCount + action.amount };
    case 'CONTINUE_AFTER_WIN':
      return { ...state, status: 'playing' };
    case 'RESTART':
      return createInitialState();
    default:
      return state;
  }
}

export function useGameState(initialData?: SavedGameData | null) {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => (initialData ? createStateFromSaved(initialData) : createInitialState())
  );

  const swipe = useCallback((direction: Direction) => dispatch({ type: 'SWIPE', direction }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);
  const continueAfterWin = useCallback(() => dispatch({ type: 'CONTINUE_AFTER_WIN' }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const addUndos = useCallback((amount: number) => dispatch({ type: 'ADD_UNDOS', amount }), []);

  const canUndo = state.undoCount > 0 && state.history.length > 0;

  return { state, swipe, restart, continueAfterWin, undo, addUndos, canUndo };
}