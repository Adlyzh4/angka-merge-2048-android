// src/theme/colors.ts

export const lightTheme = {
  background: '#FAF8EF',
  boardBackground: '#BBADA0',
  textPrimary: '#776E65',
  textOnDark: '#F9F6F2',
  buttonBackground: '#8F7A66',
};

export const darkTheme = {
  background: '#1A1A1A',
  boardBackground: '#3D3A34',
  textPrimary: '#F9F6F2',
  textOnDark: '#F9F6F2',
  buttonBackground: '#5C4F42',
};

export function getTheme(isDark: boolean) {
  return isDark ? darkTheme : lightTheme;
}

export const menuTheme = {
  textPrimary: '#7A3E1D',
  textOnDark: '#FFFFFF',
  primaryButton: '#FF8A3D',
  secondaryButton: '#FFFBF3',
  secondaryButtonText: '#E8703C',
  exitBorder: '#B0413E',
};