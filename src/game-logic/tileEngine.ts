// src/game-logic/tileEngine.ts
import { GRID_SIZE } from './grid';

export interface TileEntity {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

let idCounter = 1;
function nextId(): number {
  return idCounter++;
}

function getEmptyCells(tiles: TileEntity[]): [number, number][] {
  const occupied = new Set(tiles.map((t) => `${t.row},${t.col}`));
  const empty: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!occupied.has(`${r},${c}`)) empty.push([r, c]);
    }
  }
  return empty;
}

/**
 * Munculkan 1 tile baru di posisi kosong acak. Tile baru ditandai isNew=true
 * supaya komponen tau harus main animasi "muncul", bukan animasi geser.
 */
export function spawnTileEntity(tiles: TileEntity[]): TileEntity[] {
  const empty = getEmptyCells(tiles);
  if (empty.length === 0) return tiles;

  const [row, col] = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  return [
    ...tiles,
    { id: nextId(), value, row, col, isNew: true },
  ];
}

export function initTiles(): TileEntity[] {
  let tiles: TileEntity[] = [];
  tiles = spawnTileEntity(tiles);
  tiles = spawnTileEntity(tiles);
  return tiles;
}

/**
 * Konversi tiles jadi grid angka biasa. Dipakai supaya kita bisa reuse
 * hasValidMoves() & hasTileValue() dari grid.ts tanpa duplikasi logic.
 */
export function tilesToGrid(tiles: TileEntity[]): number[][] {
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  tiles.forEach((t) => {
    grid[t.row][t.col] = t.value;
  });
  return grid;
}

/**
 * Fungsi inti: geser & merge tiles ke arah tertentu, sambil mempertahankan
 * id tiap tile yang cuma pindah posisi (bukan merge), supaya animasi geser
 * bisa mengikuti tile yang sama.
 */
export function moveTiles(
  tiles: TileEntity[],
  direction: Direction
): { tiles: TileEntity[]; scoreGained: number; moved: boolean } {
  const isHorizontal = direction === 'left' || direction === 'right';
  const isReverse = direction === 'right' || direction === 'down';

  let scoreGained = 0;
  const resultTiles: TileEntity[] = [];

  for (let lineIndex = 0; lineIndex < GRID_SIZE; lineIndex++) {
    let lineTiles = tiles
      .filter((t) => (isHorizontal ? t.row === lineIndex : t.col === lineIndex))
      .sort((a, b) => (isHorizontal ? a.col - b.col : a.row - b.row));

    if (isReverse) lineTiles = lineTiles.reverse();

    let position = isReverse ? GRID_SIZE - 1 : 0;
    const step = isReverse ? -1 : 1;
    let i = 0;

    while (i < lineTiles.length) {
      const current = lineTiles[i];
      const next = lineTiles[i + 1];

      if (next && next.value === current.value) {
        // Merge: bikin tile BARU (id baru) dengan nilai gabungan.
        // Tile lama "hilang" (digantikan tile hasil merge).
        const mergedValue = current.value * 2;
        scoreGained += mergedValue;
        resultTiles.push({
          id: nextId(),
          value: mergedValue,
          row: isHorizontal ? lineIndex : position,
          col: isHorizontal ? position : lineIndex,
          isMerged: true,
        });
        i += 2;
      } else {
        resultTiles.push({
          ...current,
          row: isHorizontal ? lineIndex : position,
          col: isHorizontal ? position : lineIndex,
          isNew: false,
          isMerged: false,
        });
        i += 1;
      }
      position += step;
    }
  }

  const originalPositions = new Map(tiles.map((t) => [t.id, `${t.row},${t.col}`]));
  const moved =
    tiles.length !== resultTiles.length ||
    resultTiles.some((r) => r.isMerged || originalPositions.get(r.id) !== `${r.row},${r.col}`);

  return { tiles: resultTiles, scoreGained, moved };
}