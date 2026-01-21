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
          color={Colors.primary}
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
    backgroundColor: Colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    elevation: 10,
  },
  image: { width: 40, height: 40, borderRadius: 8 },
  text: { flex: 1, marginLeft: 12 },
  title: { fontSize: 14, fontWeight: '600' },
  artist: { fontSize: 12, color: Colors.secondary },
});
