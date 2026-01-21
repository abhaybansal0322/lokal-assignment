import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from '../store/playerStore';
import { Colors } from '../constants/Colors';

export default function PlayerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [showQueue, setShowQueue] = useState(false);
  const song = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const pause = usePlayerStore((s) => s.pause);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) => s.duration);
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const playSongAtIndex = usePlayerStore((s) => s.playSongAtIndex);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const moveQueueItem = usePlayerStore((s) => s.moveQueueItem);

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

        {/* Queue Toggle Button */}
        <TouchableOpacity
          onPress={() => setShowQueue((v) => !v)}
          style={styles.queueToggle}
        >
          <Text style={styles.queueToggleText}>
            {showQueue ? 'Hide Queue' : 'Show Queue'}
          </Text>
        </TouchableOpacity>

        {/* Queue List */}
        {showQueue && (
          <ScrollView style={styles.queueContainer}>
            {queue.map((s, index) => (
              <View
                key={s.id + index}
                style={[
                  styles.queueItem,
                  index === currentIndex && styles.activeQueueItem,
                ]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => playSongAtIndex(index)}
                >
                  <Text
                    style={styles.queueTitle}
                    numberOfLines={1}
                  >
                    {s.title}
                  </Text>
                  <Text
                    style={styles.queueArtist}
                    numberOfLines={1}
                  >
                    {s.artist}
                  </Text>
                </TouchableOpacity>

                <View style={styles.queueActions}>
                  <TouchableOpacity
                    onPress={() => moveQueueItem(index, index - 1)}
                    disabled={index === 0}
                  >
                    <Text style={[styles.queueAction, index === 0 && styles.disabled]}>↑</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => moveQueueItem(index, index + 1)}
                    disabled={index === queue.length - 1}
                  >
                    <Text style={[styles.queueAction, index === queue.length - 1 && styles.disabled]}>↓</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => removeFromQueue(index)}
                  >
                    <Text style={[styles.queueAction, styles.remove]}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
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

  queueToggle: {
    marginTop: 20,
  },

  queueToggleText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  queueContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 16,
    maxHeight: 200,
  },

  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  activeQueueItem: {
    backgroundColor: Colors.card,
  },

  queueTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  queueArtist: {
    color: Colors.secondary,
    fontSize: 12,
  },

  queueActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 10,
  },

  queueAction: {
    fontSize: 18,
    color: Colors.secondary,
  },

  disabled: {
    color: '#666',
    opacity: 0.5,
  },

  remove: {
    color: '#E53935',
  },
});

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
