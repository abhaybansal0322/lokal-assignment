// Songs API
import { apiGet } from './client';
import { PlayerSong } from '../types/song';

/**
 * Handle individual song API calls
 */

interface ApiDownloadUrl {
    quality: string;
    url: string;
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

    console.log(
        '[SONG API]',
        songData.name,
        songData.downloadUrl
    );

    // extract 500x500 image
    const imageObj = songData.image.find((img) => img.quality === '500x500') || songData.image[songData.image.length - 1];
    const imageUrl = imageObj ? imageObj.link : '';

    // extract highest quality audio URL safely
    let audioUrl = '';

    if (Array.isArray(songData.downloadUrl)) {
        const validUrls = songData.downloadUrl.filter(
            (u) => typeof u?.url === 'string' && u.url.length > 0
        );

        if (validUrls.length > 0) {
            // pick highest quality (last item)
            audioUrl = validUrls[validUrls.length - 1].url;
        }
    }

    if (!audioUrl) {
        throw new Error('No playable audio URL found for this song');
    }

    return {
        id: songData.id,
        title: songData.name,
        artist: songData.artists.primary.map((a) => a.name).join(', '),
        album: songData.album?.name ?? '',
        duration: Number(songData.duration),
        imageUrl,
        audioUrl, // ✅ now correct
    };

}

