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
    if (unsubscribe) return;

    initAudioMode();

    // 1️⃣ Subscribe ONLY to currentSong
    const unsubscribeSong = usePlayerStore.subscribe(
        (state) => state.currentSong,
        (currentSong) => {
            const songId = currentSong?.id ?? null;

            if (songId !== previousSongId) {
                if (currentSong) {
                    loadAndPlaySong(currentSong);
                } else {
                    stopAndUnload();
                }
                previousSongId = songId;
            }
        }
    );

    // 2️⃣ Subscribe ONLY to isPlaying
    const unsubscribePlayState = usePlayerStore.subscribe(
        (state) => state.isPlaying,
        (isPlaying) => {
            if (isPlaying !== previousIsPlaying) {
                if (isPlaying) {
                    play();
                } else {
                    pause();
                }
                previousIsPlaying = isPlaying;
            }
        }
    );

    // 3️⃣ Single unsubscribe handler
    unsubscribe = () => {
        unsubscribeSong();
        unsubscribePlayState();
    };
}
