import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from '../store/playerStore';
import { Colors } from '../constants/Colors';

export default function MiniPlayer() {
  const navigation = useNavigation();
  const song = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const pause = usePlayerStore((s) => s.pause);

  console.log('[MINI PLAYER SONG]', song);

  if (!song) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Player' as never)}
    >
      <Image source={{ uri: song.imageUrl }} style={styles.image} />

      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{song.artist}</Text>
      </View>

      <TouchableOpacity onPress={() => isPlaying ? pause() : play()}>
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={22}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  image: { width: 40, height: 40, borderRadius: 8 },
  text: { flex: 1, marginLeft: 12 },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  artist: {
    fontSize: 12,
    color: '#B3B3B3',
  },
});
