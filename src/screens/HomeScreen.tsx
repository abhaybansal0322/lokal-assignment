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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchSongs, getSongById } from '../api';
import { usePlayerStore } from '../store/playerStore';
import { SongSummary } from '../types/song';
import { Colors } from '../constants/Colors';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SongSummary[]>([]);
  const [activeTab, setActiveTab] = useState('Songs');
  const [artists, setArtists] = useState<string[]>([]);
  const insets = useSafeAreaInsets();

  const setQueue = usePlayerStore((s) => s.setQueue);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const { songs } = await searchSongs(query, 1);
    setResults(songs);

    // Build artists list with proper deduplication
    const artistSet = new Set<string>();

    songs.forEach((song) => {
      if (!song.artist) return;

      song.artist
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0)
        .forEach((a) => artistSet.add(a));
    });

    const artistArray = Array.from(artistSet);
    setArtists(artistArray);
    console.log('[ARTISTS]', artistArray);
  };

  const playSong = async (song: SongSummary) => {
    const index = results.findIndex((s) => s.id === song.id);

    // Fetch full details for ALL songs in list
    const fullQueue = await Promise.all(
      results.map((s) => getSongById(s.id))
    );

    setQueue(fullQueue, index);
  };

  const renderSongItem = ({ item }: { item: SongSummary }) => (
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

  const renderArtistItem = ({ item }: { item: string }) => (
    <View style={styles.row}>
      <View style={styles.artistAvatar}>
        <Ionicons name="person" size={20} color={Colors.primary} />
      </View>

      <Text style={styles.title}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Safe Area */}
      <SafeAreaView style={styles.safe}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <View style={styles.headerLeft}>
            <Ionicons
              name="musical-notes"
              size={22}
              color={Colors.primary}
            />
            <Text style={styles.headerTitle}>Music Player</Text>
          </View>
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
      </SafeAreaView>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['Suggested', 'Songs', 'Artists'].map((tab) => (
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

      {results.length === 0 && activeTab !== 'Suggested' ? (
        <Text style={styles.empty}>Search for songs to begin</Text>
      ) : (
        <>
          {activeTab === 'Songs' && (
            <FlatList
              data={results}
              keyExtractor={(i) => i.id}
              renderItem={renderSongItem}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}

          {activeTab === 'Artists' && (
            artists.length === 0 ? (
              <Text style={styles.empty}>No artists found</Text>
            ) : (
              <FlatList
                data={artists}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={renderArtistItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            )
          )}

          {activeTab === 'Suggested' && (
            <Text style={styles.empty}>Suggested coming soon</Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  safe: {
    backgroundColor: Colors.background,
  },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 8,
    color: Colors.text,
  },

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

  artistAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});
