import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchSongs, getSongById } from '../api';
import { usePlayerStore } from '../store/playerStore';
import { SongSummary } from '../types/song';
import { Colors } from '../constants/Colors';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SongSummary[]>([]);
  const [activeTab, setActiveTab] = useState('Songs');

  const setQueue = usePlayerStore((s) => s.setQueue);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const { songs } = await searchSongs(query, 1);
    setResults(songs);
  };

  const playSong = async (song: SongSummary) => {
    const fullSong = await getSongById(song.id);
    console.log('[PLAY]', fullSong.title, fullSong.audioUrl);
    setQueue([fullSong], 0);
  };

  const renderItem = ({ item }: { item: SongSummary }) => (
    <TouchableOpacity style={styles.row} onPress={() => playSong(item)}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
      </View>

      <Ionicons name="play" size={22} color={Colors.primary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logoIcon}>🎵</Text>
          <Text style={styles.logoText}>Mume</Text>
        </View>
        <Ionicons name="search" size={22} color={Colors.text} />
      </View>

      {/* Search */}
      <TextInput
        style={styles.search}
        placeholder="Search songs"
        placeholderTextColor={Colors.secondary}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        {['Suggested', 'Songs', 'Artists', 'Albums'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText,
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {results.length === 0 ? (
        <Text style={styles.empty}>Search for songs to begin</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },

  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { fontSize: 20 },
  logoText: { fontSize: 22, fontWeight: '700', marginLeft: 6 },

  search: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    fontSize: 16,
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },

  tabText: {
    fontSize: 14,
    color: Colors.secondary,
  },

  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },

  empty: {
    marginTop: 48,
    textAlign: 'center',
    color: Colors.secondary,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  imageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },

  textContainer: { flex: 1, marginLeft: 12 },

  title: { fontSize: 16, fontWeight: '600' },
  artist: { fontSize: 14, color: Colors.secondary, marginTop: 2 },

  separator: {
    height: 1,
    backgroundColor: Colors.separator,
    marginLeft: 76,
  },
});
