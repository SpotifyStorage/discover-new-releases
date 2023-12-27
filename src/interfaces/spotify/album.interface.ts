import { Artist } from "./artist.interface";
import { Cover } from "./cover.interface";
import { Disc } from "./disc.interface";

export interface Album {
    album_type: "album" | "single" | "compilation";
    total_tracks: number;
    available_markets: string[];
    href: string;
    id: string;
    // images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    type: string;
    uri: string;
    artists: Artist[];
    tracks: AlbumTracks;
    genres: string[];
    label: string;
    popularity: number;
    // copyrights: Copyright[];
    // external_ids: ExternalIds;
    // restrictions: Restrictions;
    // external_urls: ExternalUrls;
}

interface AlbumTracks {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: AlbumTrackItem[];
}

export interface AlbumTrackItem {
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    // external_urls: ExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    // linked_from: {
    //   external_urls: ExternalUrls;
    //   href: string;
    //   id: string;
    //   type: string;
    //   uri: string;
    // };
    // restrictions: {
    //   reason: string;
    // };
    name: string;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
}