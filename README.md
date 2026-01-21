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

The app is structured to clearly separate UI, state, audio, and API logic.

### 1. API Layer (src/api)

Responsible for all network requests and normalizes raw API responses into clean app-level data.

Key files:
- `search.ts` – search songs
- `songs.ts` – fetch full song details
- `client.ts` – shared API client

### 2. State Management (src/store)

Uses Zustand for lightweight global state managing:
- Current song
- Playback state
- Queue
- Navigation between songs

State does not manage audio playback directly, keeping it predictable and easy to reason about.

### 3. Audio Layer (src/services)

Encapsulates all audio playback logic:
- Loading / unloading audio
- Play / pause
- Next / previous

Prevents multiple audio instances and synchronizes audio state with the store via a dedicated sync layer.

### 4. UI Layer (src/screens, src/components)

**Screens:**
- Home (search, songs, artists)
- Player (expanded view)

**Components:**
- Mini player (persistent playback control)

UI reads state but does not control audio directly, keeping it declarative and simple.

## Trade-offs & Design Decisions

### 1. No progress bar scrubbing
- The progress bar is visual only
- Seeking via touch was intentionally excluded to reduce complexity
- Playback remains stable and predictable

### 2. Artists derived from search results
- No separate artists API is used
- Artist list is dynamically derived from song search data
- Keeps implementation simple and avoids unnecessary API calls

### 3. Local polling for playback progress
- Playback position is read periodically instead of using global listeners
- Avoids memory leaks and keeps audio logic isolated

### 4. No persistence across app restarts
- Last played song is not restored on app relaunch
- Out of scope for assignment; avoids AsyncStorage complexity

## Notes

- All songs, artists, and images are fetched dynamically
- No data is hardcoded
- The app was tested on a real iOS device using Expo Go
