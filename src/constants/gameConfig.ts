// src/constants/gameConfig.ts

export const GRID_SIZE = 4;
export const TILE_GAP = 8;
export const BOARD_PADDING = 12;

export const SWIPE_THRESHOLD = 20; // minimal jarak (px) buat dianggap swipe valid

export const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: '#CDC1B4', text: '#CDC1B4' },
  2: { bg: '#EEE4DA', text: '#776E65' },
  4: { bg: '#EDE0C8', text: '#776E65' },
  8: { bg: '#F2B179', text: '#F9F6F2' },
  16: { bg: '#F59563', text: '#F9F6F2' },
  32: { bg: '#F67C5F', text: '#F9F6F2' },
  64: { bg: '#F65E3B', text: '#F9F6F2' },
  128: { bg: '#EDCF72', text: '#F9F6F2' },
  256: { bg: '#EDCC61', text: '#F9F6F2' },
  512: { bg: '#EDC850', text: '#F9F6F2' },
  1024: { bg: '#EDC53F', text: '#F9F6F2' },
  2048: { bg: '#EDC22E', text: '#F9F6F2' },
};

export function getTileColor(value: number) {
  return TILE_COLORS[value] ?? { bg: '#3C3A32', text: '#F9F6F2' };
}