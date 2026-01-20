import { usePlayerStore } from '../store/playerStore';
import {
    initAudioMode,
    loadAndPlaySong,
    play,
    pause,
    stopAndUnload,
} from './audioService';

let previousSongId: string | null = null;
let previousIsPlaying: boolean | null = null;
let unsubscribe: (() => void) | null = null;

export function initPlayerSync() {
    // 1. Guard against multiple initialization
    if (unsubscribe) {
        return;
    }

    // 2. Initialize audio mode
    initAudioMode();

    // 3. Subscribe to the Zustand store
    unsubscribe = usePlayerStore.subscribe((state) => {
        // A. Handle song changes
        const currentSongId = state.currentSong?.id || null;

        if (currentSongId !== previousSongId) {
            if (state.currentSong) {
                loadAndPlaySong(state.currentSong);
            } else {
                stopAndUnload();
            }
            previousSongId = currentSongId;
        }

        // B. Handle play / pause changes
        if (state.isPlaying !== previousIsPlaying) {
            if (state.isPlaying) {
                play();
            } else {
                pause();
            }
            previousIsPlaying = state.isPlaying;
        }
    });
}
