import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from '../store/playerStore';
import { Colors } from '../constants/Colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define minimal navigation types locally or import if available
// Assuming 'Player' is a valid route name from AppNavigator
type RootStackParamList = {
    Player: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MiniPlayer() {
    const navigation = useNavigation<NavigationProp>();
    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const play = usePlayerStore((state) => state.play);
    const pause = usePlayerStore((state) => state.pause);

    if (!currentSong) {
        return null;
    }

    const handlePress = () => {
        navigation.navigate('Player');
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.contentContainer}
                onPress={handlePress}
                activeOpacity={0.9}
            >
                <Image source={{ uri: currentSong.imageUrl }} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {currentSong.title}
                    </Text>
                    <Text style={styles.artist} numberOfLines={1}>
                        {currentSong.artist}
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.controlButton}
                onPress={handlePlayPause}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Text style={styles.controlText}>
                    {isPlaying ? 'Pause' : 'Play'}
                </Text>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 72,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: Colors.card,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: -4 },
        shadowRadius: 8,
        elevation: 20,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

    image: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: Colors.border,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    title: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    artist: {
        color: Colors.secondary,
        fontSize: 12,
        marginTop: 2,
    },
    controlButton: {
        padding: 8,
    },
    controlText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
});
