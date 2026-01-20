// Search type definitions
import { SongSummary } from './song';

export interface SearchResult {
    songs: SongSummary[];
    total: number;
}

