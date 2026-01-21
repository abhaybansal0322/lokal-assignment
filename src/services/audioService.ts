import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

import { PlayerSong } from '../types/song';

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
        // Fail silently or log if needed, user requested specifically not to throw unless critical
    }
}


export async function loadAndPlaySong(song: PlayerSong) {
    if (currentSongId === song.id) return;

    if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        sound = null;
    }

    try {
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: song.audioUrl },
            { shouldPlay: false }
        );

        sound = newSound;
        currentSongId = song.id;

        // ✅ play only once, manually
        await newSound.playAsync();

    } catch (error) {
        console.error('Failed to load song:', error);
        sound = null;
        currentSongId = null;
    }
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



