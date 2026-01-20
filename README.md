# 🎵 Music Player App (React Native)

A fully functional music streaming mobile app built using React Native (Expo) and the JioSaavn API, featuring background playback, a persistent mini player, and a synchronized full player experience.

This project focuses on clean architecture, state management, and real-world playback challenges, rather than just UI.

## ✨ Features

- **🔍 Song Search** with pagination (JioSaavn API)
- **▶️ Background Audio Playback**
  - Continues when app is minimized
  - Continues when screen is locked
- **🎧 Persistent Mini Player**
  - Visible across all screens
  - Always in sync with the full player
- **🖥️ Full Player Screen**
  - Large album art
  - Play / Pause
  - Next / Previous
  - Seek bar (UI placeholder)
- **🧠 Centralized Player State**
  - Queue management
  - Playback state synchronization
- **⚡ Clean, scalable architecture**
  - ❌ No mock data

## 🛠️ Tech Stack

- **React Native (Expo)**
- **TypeScript**
- **React Navigation v6**
- **Zustand** – Global state management
- **Expo AV** – Audio playback & background handling
- **AsyncStorage** – Persistent storage (optional usage)

## 🧩 Architecture Overview

The app is designed with strict separation of concerns to ensure reliability and scalability.

```
UI (Screens & Components)
        ↓
Zustand Store (Playback Intent)
        ↓
Player Sync Layer
        ↓
Audio Service (Expo AV)
        ↓
Device Audio
```

### 🔑 Key Architectural Decisions

1.  **Zustand Store**
    *   Stores only intent (play, pause, next, queue)
    *   No audio logic inside the store
2.  **Audio Service**
    *   Sole owner of `Audio.Sound`
    *   Handles background playback, loading, unloading
3.  **Sync Layer**
    *   Listens to Zustand store changes
    *   Translates state changes into audio actions
    *   Guarantees Mini Player and Full Player never desync

**This design prevents:**
*   Duplicate audio instances
*   UI-driven playback bugs
*   State inconsistency across screens

## 📁 Folder Structure

```
src/
├── api/                # API abstraction layer
├── components/         # Reusable UI components (MiniPlayer)
├── navigation/         # React Navigation setup
├── screens/            # App screens (Home, Player)
├── services/           # AudioService & Sync Layer
├── store/              # Zustand global store
├── types/              # TypeScript types
└── constants/          # Theme & colors
```

## 🔊 Background Playback Handling

Audio continues when:
- App is minimized
- Screen is locked

Handled using Expo AV with:
- Silent mode playback (iOS)
- Background audio enabled
- Proper interruption handling

## ⚖️ Trade-offs & Design Choices

- **Seek bar**: Implemented as UI placeholder. Full seek tracking intentionally skipped to keep scope focused.
- **Song playback**: Full song details are fetched on demand when a song is tapped. Avoids over-fetching and stale state.
- **No over-engineering**: No unnecessary caching. No premature optimizations. Clean and readable code prioritized.

## 🚀 Getting Started

### Prerequisites

- Node.js
- Expo CLI

### Installation

```bash
npm install
npx expo start
```

Scan the QR code using Expo Go or run on an emulator.
