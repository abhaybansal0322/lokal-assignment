import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

import { PlayerSong } from '../types/song';
import { usePlayerStore } from '../store/playerStore';

let sound: Audio.Sound | null = null;
let currentSongId: string | null = null;

export async function initAudioMode() {
    try {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,

        });
    } catch (error) {
        // Silently fail
    }
}


export async function loadAndPlaySong(song: PlayerSong) {
  if (!song.audioUrl) return;

  if (currentSongId === song.id) return;

  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
  }

  const { sound: newSound } = await Audio.Sound.createAsync(
    { uri: song.audioUrl },
    { shouldPlay: true }
  );

  sound = newSound;
  currentSongId = song.id;

  sound.setOnPlaybackStatusUpdate((status) => {
    if (!status.isLoaded) return;

    const position = status.positionMillis / 1000;
    const duration = (status.durationMillis ?? 0) / 1000;

    usePlayerStore.getState().setProgress(position, duration);

    if (status.didJustFinish) {
      usePlayerStore.getState().next();
    }
  });
}

export async function play() {
    if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) {
            await sound.playAsync();
        }
    }
}

export async function pause() {
    if (sound) {
        await sound.pauseAsync();
    }
}

export async function stopAndUnload() {
    if (sound) {
        try {
            await sound.stopAsync();
        } catch (e) { /* ignore already stopped */ }

        try {
            await sound.unloadAsync();
        } catch (e) { /* ignore already unloaded */ }

        sound = null;
        currentSongId = null;
    }
}



