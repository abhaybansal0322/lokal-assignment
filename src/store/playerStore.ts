import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerSong } from '../types/song';

const QUEUE_STORAGE_KEY = 'PLAYER_QUEUE_V1';

async function persistQueue(queue: PlayerSong[], currentIndex: number) {
  try {
    await AsyncStorage.setItem(
      QUEUE_STORAGE_KEY,
      JSON.stringify({ queue, currentIndex })
    );
  } catch (e) {
    // Silently fail – persistence should never break playback
  }
}

interface PlayerState {
    currentSong: PlayerSong | null;
    isPlaying: boolean;
    queue: PlayerSong[];
    currentIndex: number;

    position: number; // seconds
    duration: number; // seconds

    // Actions
    setProgress: (position: number, duration: number) => void;
    setQueue: (songs: PlayerSong[], initialIndex?: number) => void;
    playSongAtIndex: (index: number) => void;
    play: () => void;
    pause: () => void;
    next: () => void;
    previous: () => void;
    addToQueue: (song: PlayerSong) => void;
    removeFromQueue: (index: number) => void;
    moveQueueItem: (fromIndex: number, toIndex: number) => void;
    restoreQueue: () => Promise<void>;
}

export const usePlayerStore = create<PlayerState>()(subscribeWithSelector((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,
    position: 0,
    duration: 0,

    setProgress: (position, duration) => {
        set({ position, duration });
    },

    setQueue: (songs, initialIndex = 0) => {
        if (songs.length === 0) {
            set({
                queue: [],
                currentIndex: -1,
                currentSong: null,
                isPlaying: false,
            });
            persistQueue([], -1);
            return;
        }
        set({
            queue: songs,
            currentIndex: initialIndex,
            currentSong: songs[initialIndex] || null,
            isPlaying: true,
        });
        persistQueue(songs, initialIndex);
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
                position: 0,
            });
            persistQueue(queue, nextIndex);
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
                position: 0,
            });
            persistQueue(queue, prevIndex);
        }
    },

    addToQueue: (song) => {
        const { queue, currentIndex } = get();
        const newQueue = [...queue, song];
        set({
            queue: newQueue,
        });
        persistQueue(newQueue, currentIndex);
    },

    removeFromQueue: (index) => {
        const { queue, currentIndex } = get();

        if (index < 0 || index >= queue.length) return;

        const newQueue = queue.filter((_, i) => i !== index);
        let newIndex = currentIndex;

        if (index < currentIndex) {
            newIndex = currentIndex - 1;
        } else if (index === currentIndex) {
            newIndex = Math.min(currentIndex, newQueue.length - 1);
        }

        set({
            queue: newQueue,
            currentIndex: newQueue.length ? newIndex : -1,
            currentSong: newQueue.length ? newQueue[newIndex] : null,
            isPlaying: newQueue.length ? true : false,
        });
        persistQueue(newQueue, newQueue.length ? newIndex : -1);
    },

    moveQueueItem: (fromIndex, toIndex) => {
        const { queue, currentIndex } = get();

        if (
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= queue.length ||
            toIndex >= queue.length
        ) {
            return;
        }

        const updatedQueue = [...queue];
        const [movedItem] = updatedQueue.splice(fromIndex, 1);
        updatedQueue.splice(toIndex, 0, movedItem);

        let newIndex = currentIndex;

        if (fromIndex === currentIndex) {
            newIndex = toIndex;
        } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
            newIndex = currentIndex - 1;
        } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
            newIndex = currentIndex + 1;
        }

        set({
            queue: updatedQueue,
            currentIndex: newIndex,
            currentSong: updatedQueue[newIndex] || null,
        });
        persistQueue(updatedQueue, newIndex);
    },

    restoreQueue: async () => {
        try {
            const stored = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
            if (!stored) return;

            const parsed = JSON.parse(stored);
            const { queue, currentIndex } = parsed;

            if (!Array.isArray(queue) || queue.length === 0) return;

            const safeIndex =
                typeof currentIndex === 'number' &&
                currentIndex >= 0 &&
                currentIndex < queue.length
                    ? currentIndex
                    : 0;

            set({
                queue,
                currentIndex: safeIndex,
                currentSong: queue[safeIndex],
                isPlaying: false, // do NOT auto-play on restore
            });
        } catch (e) {
            // silently fail – restore should never crash app
        }
    },
})));

