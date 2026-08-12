// src/game-logic/grid.ts

export type Grid = number[][];
export type Direction = "up" | "down" | "left" | "right";

export const GRID_SIZE = 4;

/**
 * Bikin grid kosong (semua sel = 0)
 */
export function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => 0)
  );
}

/**
 * Cari semua posisi sel yang kosong (nilai 0)
 */
function getEmptyCells(grid: Grid): [number, number][] {
  const empty: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }
  return empty;
}

/**
 * Munculkan 1 tile baru di posisi kosong acak.
 * 90% peluang nilai 2, 10% peluang nilai 4.
 * Return grid baru (tidak mutasi grid asli).
 */
export function spawnRandomTile(grid: Grid): Grid {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) return grid;

  const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newValue = Math.random() < 0.9 ? 2 : 4;

  const newGrid = grid.map((row) => [...row]);
  newGrid[r][c] = newValue;
  return newGrid;
}

/**
 * Geser & merge 1 baris ke kiri.
 * Ini fungsi inti yang dipakai ulang untuk 4 arah (dengan rotasi grid).
 * Return: { row: baris hasil, scoreGained: skor dari merge di baris ini }
 */
function slideAndMergeRow(row: number[]): { row: number[]; scoreGained: number } {
  const filtered = row.filter((val) => val !== 0);
  const merged: number[] = [];
  let scoreGained = 0;

  let i = 0;
  while (i < filtered.length) {
    if (filtered[i] === filtered[i + 1]) {
      const mergedValue = filtered[i] * 2;
      merged.push(mergedValue);
      scoreGained += mergedValue;
      i += 2; // skip 2 elemen karena udah di-merge
    } else {
      merged.push(filtered[i]);
      i += 1;
    }
  }

  while (merged.length < GRID_SIZE) {
    merged.push(0);
  }

  return { row: merged, scoreGained };
}

/**
 * Rotasi grid 90 derajat searah jarum jam.
 * Dipakai supaya logic "geser kiri" bisa dipakai ulang untuk semua arah.
 */
function rotateGrid(grid: Grid): Grid {
  const newGrid = createEmptyGrid();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[c][GRID_SIZE - 1 - r] = grid[r][c];
    }
  }
  return newGrid;
}

/**
 * Fungsi utama: geser seluruh grid ke arah tertentu.
 * Return grid baru, total skor tambahan, dan apakah ada perubahan (moved).
 */
export function moveGrid(
  grid: Grid,
  direction: Direction
): { grid: Grid; scoreGained: number; moved: boolean } {
  // Normalisasi: rotasi grid supaya kita selalu bisa pakai logic "geser kiri"
  let rotations = 0;
  switch (direction) {
    case "left":
      rotations = 0;
      break;
    case "up":
      rotations = 3;
      break;
    case "right":
      rotations = 2;
      break;
    case "down":
      rotations = 1;
      break;
  }

  let workingGrid = grid;
  for (let i = 0; i < rotations; i++) {
    workingGrid = rotateGrid(workingGrid);
  }

  let totalScoreGained = 0;
  const resultRows = workingGrid.map((row) => {
    const { row: newRow, scoreGained } = slideAndMergeRow(row);
    totalScoreGained += scoreGained;
    return newRow;
  });

  // Rotasi balik ke orientasi asli
  let finalGrid = resultRows;
  const rotationsBack = (4 - rotations) % 4;
  for (let i = 0; i < rotationsBack; i++) {
    finalGrid = rotateGrid(finalGrid);
  }

  const moved = JSON.stringify(grid) !== JSON.stringify(finalGrid);

  return { grid: finalGrid, scoreGained: totalScoreGained, moved };
}

/**
 * Cek apakah masih ada gerakan valid (belum game over).
 * Caranya: coba simulasikan 4 arah, kalau salah satu bikin perubahan, berarti masih bisa main.
 */
export function hasValidMoves(grid: Grid): boolean {
  const directions: Direction[] = ["up", "down", "left", "right"];
  return directions.some((dir) => moveGrid(grid, dir).moved);
}

/**
 * Cek apakah ada tile dengan nilai tertentu (default 2048) di grid.
 * Dipakai untuk deteksi "menang".
 */
export function hasTileValue(grid: Grid, target: number = 2048): boolean {
  return grid.some((row) => row.some((cell) => cell >= target));
}

/**
 * Inisialisasi game baru: grid kosong + 2 tile awal.
 */
export function initializeGame(): Grid {
  let grid = createEmptyGrid();
  grid = spawnRandomTile(grid);
  grid = spawnRandomTile(grid);
  return grid;
}