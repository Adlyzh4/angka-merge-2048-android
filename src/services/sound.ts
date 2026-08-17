// src/services/sound.ts
import { createAudioPlayer, AudioPlayer } from 'expo-audio';

let mergePlayer: AudioPlayer | null = null;
let gameOverPlayer: AudioPlayer | null = null;
let clickPlayer: AudioPlayer | null = null;

export function initSounds() {
  mergePlayer = createAudioPlayer(require('../../assets/sounds/merge.mp3'));
  gameOverPlayer = createAudioPlayer(require('../../assets/sounds/gameover.mp3'));
  clickPlayer = createAudioPlayer(require('../../assets/sounds/click.mp3'));
}

export function playMergeSound(enabled: boolean) {
  if (!enabled || !mergePlayer) return;
  mergePlayer.seekTo(0);
  mergePlayer.play();
}

export function playGameOverSound(enabled: boolean) {
  if (!enabled || !gameOverPlayer) return;
  gameOverPlayer.seekTo(0);
  gameOverPlayer.play();
}

export function playClickSound(enabled: boolean) {
  if (!enabled || !clickPlayer) return;
  clickPlayer.seekTo(0);
  clickPlayer.play();
}