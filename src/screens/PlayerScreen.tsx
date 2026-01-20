import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { usePlayerStore } from '../store/playerStore';
import { Colors } from '../constants/Colors';

export default function PlayerScreen() {
    const { currentSong, isPlaying, play, pause, next, previous } = usePlayerStore((state) => ({
        currentSong: state.currentSong,
        isPlaying: state.isPlaying,
        play: state.play,
        pause: state.pause,
        next: state.next,
        previous: state.previous,
    }));

    if (!currentSong) {
        return null;
    }

    const handlePlayPause = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Album Art */}
            <View style={styles.artContainer}>
                <Image source={{ uri: currentSong.imageUrl }} style={styles.albumArt} />
            </View>

            {/* Song Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>{currentSong.title}</Text>
                <Text style={styles.artist} numberOfLines={1}>{currentSong.artist}</Text>
            </View>

            {/* Seek Bar Placeholder */}
            <View style={styles.seekContainer}>
                <View style={styles.seekBarTrack}>
                    <View style={styles.seekBarProgress} />
                </View>
                <View style={styles.timeLabels}>
                    <Text style={styles.timeText}>0:00</Text>
                    <Text style={styles.timeText}>-:--</Text>
                </View>
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
                <TouchableOpacity onPress={previous} style={styles.controlButton}>
                    <Text style={styles.controlText}>Prev</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handlePlayPause} style={[styles.controlButton, styles.playButton]}>
                    <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={next} style={styles.controlButton}>
                    <Text style={styles.controlText}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    artContainer: {
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    albumArt: {
        width: 280,
        height: 280,
        borderRadius: 12,
        backgroundColor: Colors.border,
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    artist: {
        fontSize: 18,
        color: Colors.secondary,
        textAlign: 'center',
    },
    seekContainer: {
        width: '80%',
        marginBottom: 40,
    },
    seekBarTrack: {
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: 2,
        marginBottom: 8,
    },
    seekBarProgress: {
        width: '30%', // Static placeholder
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    timeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        color: Colors.secondary,
        fontSize: 12,
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '70%',
    },
    controlButton: {
        padding: 10,
    },
    controlText: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: '600',
    },
    playButton: {
        backgroundColor: Colors.primary,
        borderRadius: 40,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonText: {
        fontSize: 18,
        color: '#fff', // Always white on primary
        fontWeight: 'bold',
    },
});

