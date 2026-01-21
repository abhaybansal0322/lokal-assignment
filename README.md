# 🎵 Music Player App

## Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Expo Go app on iOS / Android (for testing)

### Installation & Running
```bash
npm install
npx expo start
```

Then:
- Scan the QR code using Expo Go on your phone
- OR run on an emulator if configured

## Architecture

The app is structured with a clear separation of concerns to keep state, audio, and UI logic isolated and predictable.

### 1. API Layer (src/api)

Handles all network requests and normalizes raw API responses into clean application models. Prevents UI components from depending on API response structure.

**Key responsibilities:**
- Song search
- Fetching full song details (audio URL, images, artists)

**Key files:**
- `search.ts` – search songs and extract artists
- `songs.ts` – fetch full song details by ID
- `client.ts` – shared API client

### 2. State Management (src/store)

Uses Zustand as a single source of truth for:
- **Playback state:** current song, isPlaying
- **Queue management:** array of songs, current index
- **Position tracking:** current playback position and duration
- **Queue operations:** add, remove, reorder songs

**State persistence:**
- Queue state (songs and currentIndex) is persisted locally using AsyncStorage
- Restored on app startup
- Playback does NOT auto-resume (intentional design choice)

State management is kept free of UI and audio logic.

### 3. Audio Layer (src/services)

Encapsulates all audio playback using Expo AV.

**Handles:**
- Load / unload audio files
- Play / pause / stop
- Auto-advance to next song on completion
- Playback progress tracking via onPlaybackStatusUpdate listener

Uses a dedicated synchronization layer to keep audio in sync with global state. Prevents multiple audio instances and race conditions.

**Key files:**
- `audioService.ts` – core audio playback logic
- `playerSync.ts` – keeps audio and store in sync

### 4. UI Layer (src/screens, src/components)

**Screens:**
- `HomeScreen.tsx` – Search interface with multi-tab filtering (Songs/Artists)
- `PlayerScreen.tsx` – Full player with progress bar, queue management

**Components:**
- `MiniPlayer.tsx` – Persistent playback bar (visible on all screens)

**Design principle:** UI components remain declarative and never control audio directly. All state flows through the store.

## Trade-offs & Decisions

### 1. Seek bar interaction

The progress bar is visual only. Seeking via touch (scrubbing) was intentionally not implemented.

**Reason:**
Not required by the assignment. Priority was given to stable playback and synchronization.

### 2. Queue persistence scope

Queue state (songs and current index) is persisted locally. Playback does not auto-resume on app relaunch.

**Reason:**
Avoids unexpected playback on app start and keeps behavior predictable.

### 3. Queue UI uses simple buttons

Queue management uses ↑ ↓ ✕ buttons instead of drag gestures.

**Reason:**
Simplicity over complexity. Achieves full queue management functionality without gesture complications.

### 4. Artists derived from search results

No separate artists API. Artist list is dynamically derived from song search data.

**Reason:**
Keeps implementation simple and avoids unnecessary API calls. Artists are already included in search responses.

### 5. Queue edge-case handling

When the last remaining song in the queue is removed, playback stops and the player UI is dismissed.

**Reason:**
Clean edge-case handling. The architecture supports graceful degradation in edge cases.

## Summary

This project prioritizes:

✅ **Clean architecture** – Clear separation of concerns  
✅ **Stable audio playback** – Proper lifecycle management  
✅ **Proper synchronization** – UI, state, and audio stay in sync  
✅ **Real-world API handling** – Robust handling of inconsistent or missing data  
✅ **Local persistence** – Queue survives app reloads  
✅ **Extensibility** – Easy to add features (shuffle, repeat, offline mode)  

## Notes

- All songs, artists, and images are fetched dynamically
- No data is hardcoded
- The app was tested on a real iOS device using Expo Go
- Queue state is restored from local storage on app startup
