// src/game-logic/grid.test.ts
import { moveGrid, hasValidMoves, hasTileValue, createEmptyGrid } from "./grid";

describe("moveGrid", () => {
  test("merge dua tile sama nilai ke kiri", () => {
    const grid = createEmptyGrid();
    grid[0] = [2, 2, 0, 0];
    const result = moveGrid(grid, "left");
    expect(result.grid[0]).toEqual([4, 0, 0, 0]);
    expect(result.scoreGained).toBe(4);
    expect(result.moved).toBe(true);
  });

  test("tidak merge jika nilai beda", () => {
    const grid = createEmptyGrid();
    grid[0] = [2, 4, 0, 0];
    const result = moveGrid(grid, "left");
    expect(result.grid[0]).toEqual([2, 4, 0, 0]);
    expect(result.moved).toBe(false);
  });

  test("geser ke kanan menempel di ujung kanan", () => {
    const grid = createEmptyGrid();
    grid[0] = [2, 0, 0, 0];
    const result = moveGrid(grid, "right");
    expect(result.grid[0]).toEqual([0, 0, 0, 2]);
  });
});

describe("hasValidMoves", () => {
  test("return false kalau grid penuh dan tidak ada merge mungkin", () => {
    const grid = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(hasValidMoves(grid)).toBe(false);
  });

  test("return true kalau masih ada sel kosong", () => {
    const grid = createEmptyGrid();
    grid[0][0] = 2;
    expect(hasValidMoves(grid)).toBe(true);
  });
});

describe("hasTileValue", () => {
  test("detect tile 2048", () => {
    const grid = createEmptyGrid();
    grid[1][1] = 2048;
    expect(hasTileValue(grid)).toBe(true);
  });

  test("false kalau belum ada tile 2048", () => {
    const grid = createEmptyGrid();
    grid[1][1] = 1024;
    expect(hasTileValue(grid)).toBe(false);
  });
});