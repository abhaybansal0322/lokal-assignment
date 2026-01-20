// Songs API
import { apiGet } from './client';
import { PlayerSong } from '../types/song';

/**
 * Handle individual song API calls
 */

interface ApiDownloadUrl {
    quality: string;
    link: string;
}

interface ApiSongImage {
    quality: string;
    link: string;
}

interface ApiArtist {
    name: string;
}

interface ApiSongDetail {
    id: string;
    name: string;
    duration: number | string;
    album: {
        name: string;
    };
    artists: {
        primary: ApiArtist[];
    };
    image: ApiSongImage[];
    downloadUrl: ApiDownloadUrl[];
}

interface ApiSongResponse {
    data: ApiSongDetail[];
}

/**
 * Get full song details by ID
 * @param id - The song ID
 * @returns Clean PlayerSong object
 */
export async function getSongById(id: string): Promise<PlayerSong> {
    const response = await apiGet<ApiSongResponse>(`/api/songs/${id}`);

    // Extract data[0] as per requirement
    const songData = response.data[0];

    if (!songData) {
        throw new Error(`Song not found for ID: ${id}`);
    }

    // extract 500x500 image
    const imageObj = songData.image.find((img) => img.quality === '500x500') || songData.image[songData.image.length - 1];
    const imageUrl = imageObj ? imageObj.link : '';

    // extract highest quality audio URL (last item in downloadUrl array is typically best)
    // Logic: choose highest available quality. Assuming sorted by quality or simply taking the last one often works for Saavn. 
    // Sticking to "highest available" often means finding the 320kbps or fallback.
    // We will assume the API provides sorted or we just picking the last one as a heuristic for "best".
    const audioObj = songData.downloadUrl[songData.downloadUrl.length - 1];
    const audioUrl = audioObj ? audioObj.link : '';

    return {
        id: songData.id,
        name: songData.name,
        duration: typeof songData.duration === 'string' ? parseInt(songData.duration, 10) : songData.duration,
        albumName: songData.album.name,
        primaryArtists: songData.artists.primary.map((artist) => artist.name),
        image: imageUrl,
        audioUrl: audioUrl,
    };
}

