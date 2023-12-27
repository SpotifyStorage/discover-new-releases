import { Artist } from "./artist.interface";
import { Track } from "./track.interface";

export interface Playlist {
    collaborative: boolean;
    description: string;
    href: string;
    id: string;
    name: string;
    public: boolean;
    snapshot_id: string;
    tracks: Tracks;
    type: string;
    uri: string;
    // images: Image[];
    // owner: Owner;
    // external_urls: ExternalUrls;
    // followers: Followers;
}

export interface PlaylistTrackItem {
    added_at: string;
    is_local: boolean;
    track: Track;
    // added_by: Owner;
}

interface Tracks {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: PlaylistTrackItem[];
}

interface PlaylistAlbum {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    href: string;
    id: string;
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: {
        reason: string;
    };
    type: string;
    uri: string;
    artists: Artist[];
    // external_urls: ExternalUrls;
    // images: Image[];
}