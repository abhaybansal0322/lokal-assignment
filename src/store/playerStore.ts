import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { PlayerSong } from '../types/song';

interface PlayerState {
    currentSong: PlayerSong | null;
    isPlaying: boolean;
    queue: PlayerSong[];
    currentIndex: number;

    // Actions
    setQueue: (songs: PlayerSong[], initialIndex?: number) => void;
    playSongAtIndex: (index: number) => void;
    play: () => void;
    pause: () => void;
    next: () => void;
    previous: () => void;
}

export const usePlayerStore = create<PlayerState>()(subscribeWithSelector((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,

    setQueue: (songs, initialIndex = 0) => {
        if (songs.length === 0) {
            set({
                queue: [],
                currentIndex: -1,
                currentSong: null,
                isPlaying: false,
            });
            return;
        }
        set({
            queue: songs,
            currentIndex: initialIndex,
            currentSong: songs[initialIndex] || null,
            isPlaying: true, // Automatically start playing when queue changes
        });
    },


    playSongAtIndex: (index) => {
        const { queue } = get();
        if (index >= 0 && index < queue.length) {
            set({
                currentIndex: index,
                currentSong: queue[index],
                isPlaying: true,
            });
        }
    },

    play: () => {
        set({ isPlaying: true });
    },

    pause: () => {
        set({ isPlaying: false });
    },

    next: () => {
        const { queue, currentIndex } = get();
        if (currentIndex < queue.length - 1) {
            const nextIndex = currentIndex + 1;
            set({
                currentIndex: nextIndex,
                currentSong: queue[nextIndex],
                isPlaying: true,
            });
        }
    },

    previous: () => {
        const { queue, currentIndex } = get();
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            set({
                currentIndex: prevIndex,
                currentSong: queue[prevIndex],
                isPlaying: true,
            });
        }
    },
})));

