import { apiGet } from './client';
import { SearchResult } from '../types/search';
import { SongSummary } from '../types/song';

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

export async function searchSongs(query: string, page: number): Promise<SearchResult> {
    const response = await apiGet<ApiSearchResponse>('/api/search/songs', {
        query,
        page,
        limit: 10,
    });

    const { total, results } = response.data;

    const songs: SongSummary[] = results.map((item) => {
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

