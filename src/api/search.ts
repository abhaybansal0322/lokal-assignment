// Search API
import { apiGet } from './client';
import { SearchResult } from '../types/search';
import { SongSummary } from '../types/song';

/**
 * Handle search-related API calls
 */

interface ApiSongImage {
    quality: string;
    link: string;
}

interface ApiArtist {
    name: string;
}

interface ApiArtists {
    primary: ApiArtist[];
}

interface ApiSongResult {
    id: string;
    name: string;
    artists: ApiArtists;
    duration: number | string;
    image: ApiSongImage[];
}

interface ApiSearchResponse {
    data: {
        total: number;
        results: ApiSongResult[];
    };
}

/**
 * Search for songs
 * @param query - The search query string
 * @param page - The page number (1-based)
 * @returns SearchResult object containing transformed songs and total count
 */
export async function searchSongs(query: string, page: number): Promise<SearchResult> {
    const response = await apiGet<ApiSearchResponse>('/api/search/songs', {
        query,
        page,
        limit: 10, // Default limit, though not explicitly asked, often required. User said pass query, page.
    });

    const { total, results } = response.data;

    const songs: SongSummary[] = results.map((item) => {
        // Find 500x500 image, fallback to the last one (usually highest quality) or first
        const imageObj =
            item.image.find((img) => img.quality === '500x500') ||
            item.image[item.image.length - 1];

        return {
            id: item.id,
            title: item.name,
            artist:
                item.artists?.primary
                    ?.map((a) => a.name)
                    .join(', ') || 'Unknown Artist',
            duration:
                typeof item.duration === 'string'
                    ? parseInt(item.duration, 10)
                    : item.duration,
            imageUrl: imageObj?.url ?? '',
        };
    });


    return {
        songs,
        total,
    };
}

