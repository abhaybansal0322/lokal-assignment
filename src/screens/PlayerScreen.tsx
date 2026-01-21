import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from '../store/playerStore';
import { Colors } from '../constants/Colors';

export default function PlayerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const song = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const pause = usePlayerStore((s) => s.pause);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) => s.duration);

  if (!song) return null;

  const progress = duration ? (position / duration) * 100 : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={26}
            color={Colors.primary}
          />
          <Text style={styles.backText}>Search</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Now Playing</Text>

        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        {/* Album Art */}
        <Image source={{ uri: song.imageUrl }} style={styles.art} />

        {/* Song Info */}
        <Text style={styles.title}>{song.title}</Text>
        <Text style={styles.artist}>{song.artist}</Text>

        {/* Progress Bar */}
        <View style={styles.seekContainer}>
          <View style={styles.seekTrack}>
            <View style={[styles.seekProgress, { width: `${progress}%` }]} />
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.time}>{formatTime(position)}</Text>
            <Text style={styles.time}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <Ionicons name="play-skip-back" size={28} onPress={previous} />
          <TouchableOpacity
            style={styles.playButton}
            onPress={isPlaying ? pause : play}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={36}
              color="#fff"
            />
          </TouchableOpacity>
          <Ionicons name="play-skip-forward" size={28} onPress={next} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center' },

  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backText: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 2,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 24,
  },

  art: { width: 260, height: 260, borderRadius: 20 },

  title: { fontSize: 20, fontWeight: '700', marginTop: 24 },
  artist: { fontSize: 16, color: Colors.secondary, marginBottom: 24 },

  seekContainer: {
    width: '80%',
    marginTop: 24,
  },

  seekTrack: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },

  seekProgress: {
    width: '30%',
    height: '100%',
    backgroundColor: Colors.primary,
  },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    marginTop: 40,
  },

  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  time: {
    fontSize: 12,
    color: Colors.secondary,
  },
});

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
