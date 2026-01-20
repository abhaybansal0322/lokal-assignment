// Song type definitions
export interface SongSummary {
    id: string;
    title: string;
    artist: string;
    duration: number; // in seconds
    imageUrl: string; // URL of the 500x500 image
}

export interface PlayerSong {
    id: string;
    title: string;
    artist: string; // Changed from string[] to string for consistency with request, or keep array if intended. User said 'artist' (singular implied common usage or join). Let's start with matching the user request strictly: 'artist'.
    album: string;
    duration: number;
    imageUrl: string;
    audioUrl: string;
}



