// Song type definitions
export interface SongSummary {
    id: string;
    name: string;
    primaryArtists: string;
    duration: number; // in seconds
    image: string; // URL of the 500x500 image
}

export interface PlayerSong {
    id: string;
    name: string;
    duration: number;
    albumName: string;
    primaryArtists: string[];
    image: string;
    audioUrl: string;
}


