import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from '../store/playerStore';
import { Colors } from '../constants/Colors';

export default function PlayerScreen() {
  const navigation = useNavigation();
  const song = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const pause = usePlayerStore((s) => s.pause);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);

  if (!song) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹ Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Player</Text>
        <View style={{ width: 40 }} />
      </View>

      <Image source={{ uri: song.imageUrl }} style={styles.art} />

      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist}</Text>

      <View style={styles.seekTrack}>
        <View style={styles.seekProgress} />
      </View>

      <View style={styles.controls}>
        <Ionicons name="play-skip-back" size={28} onPress={previous} />
        <TouchableOpacity style={styles.playButton} onPress={isPlaying ? pause : play}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="play-skip-forward" size={28} onPress={next} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center' },

  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },

  back: { color: Colors.primary },
  headerTitle: { fontSize: 18, fontWeight: '600' },

  art: { width: 260, height: 260, borderRadius: 20, marginTop: 24 },

  title: { fontSize: 20, fontWeight: '700', marginTop: 24 },
  artist: { fontSize: 16, color: Colors.secondary, marginBottom: 24 },

  seekTrack: {
    width: '80%',
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
});
