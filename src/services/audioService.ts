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
    if (currentSongId === song.id) {
        return;
    }

    if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        sound = null;
    }

    try {
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: song.audioUrl },
            { shouldPlay: true }
        );

        sound = newSound;
        currentSongId = song.id;

        sound.setOnPlaybackStatusUpdate((status) => {
            if (!status.isLoaded) {
                if (status.error) {
                    console.error('Playback Error:', status.error);
                }
            }
        });


    } catch (error) {
        console.error('Failed to load song:', error);
        // Cleanup if load failed
        sound = null;
        currentSongId = null;
    }
}

export async function play() {
    if (sound) {
        await sound.playAsync();
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



