import { ArtistSimplified } from "./artist-simplified.interface";

export interface AlbumSimplified {
    album_type: "album" | "single" | "compilation";
    total_tracks: number;
    available_markets: string[];
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: {
        url: string;
        height: number;
        width: number;
    }[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: {
        reason: string;
    };
    type: string;
    uri: string;
    artists: ArtistSimplified[];
    album_group: string;
}