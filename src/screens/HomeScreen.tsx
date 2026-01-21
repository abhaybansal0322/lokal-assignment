import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
    Image,
} from 'react-native';
import { searchSongs, getSongById } from '../api';
import { usePlayerStore } from '../store/playerStore';
import { SongSummary } from '../types/song';
import { Colors } from '../constants/Colors';

export default function HomeScreen() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SongSummary[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const setQueue = usePlayerStore((state) => state.setQueue);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setPage(1);
        setResults([]);
        setHasMore(true);

        try {
            const { songs, total } = await searchSongs(query, 1);
            setResults(songs);
            setHasMore(songs.length < total && songs.length > 0);
        } catch (error) {
            console.error('Search failed', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        const nextPage = page + 1;

        try {
            const { songs } = await searchSongs(query, nextPage);
            if (songs.length === 0) {
                setHasMore(false);
            } else {
                setResults((prev) => [...prev, ...songs]);
                setPage(nextPage);
            }
        } catch (error) {
            console.error('Load more failed', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    /**
     * ✅ CORRECT PLAY HANDLER
     * - Fetch full song details
     * - Build playable queue
     * - Let playerSync + audioService handle playback
     */
    const handleSongPress = useCallback(
        async (song: SongSummary) => {
            try {
                setLoading(true);

                const fullSong = await getSongById(song.id);

                // Play only the tapped song (clean & correct)
                setQueue([fullSong], 0);
            } catch (error) {
                console.error('Failed to play song', error);
            } finally {
                setLoading(false);
            }
        },
        [setQueue]
    );

    const renderItem = ({ item }: { item: SongSummary }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleSongPress(item)}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.itemArtist} numberOfLines={1}>
                    {item.artist}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search songs..."
                    placeholderTextColor={Colors.border}
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
            </View>

            {loading && page === 1 && (
                <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
            )}

            {!loading && results.length === 0 && (
                <View style={{ marginTop: 48, alignItems: 'center' }}>
                    <Text style={{ color: Colors.secondary, fontSize: 16 }}>
                        Search for songs to begin
                    </Text>
                </View>
            )}

            <FlatList
                data={results}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading && page > 1 ? <ActivityIndicator color={Colors.primary} /> : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        backgroundColor: Colors.background,
    },
    searchInput: {
        height: 48,
        borderRadius: 12,
        backgroundColor: Colors.card,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.text,
        borderWidth: 0,
    },
    loader: {
        marginTop: 20,
    },
    listContent: {
        padding: 16,
        paddingBottom: 120,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 12,
        borderRadius: 16,
        backgroundColor: Colors.card,
    },
    itemImage: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: Colors.border,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    itemArtist: {
        fontSize: 14,
        color: Colors.secondary,
        marginTop: 4,
    },
});
