import { Album } from "./album.interface";
import { Artist } from "./artist.interface";
import { TrackSimplified } from "./track-simplified.interface";

export interface Track extends TrackSimplified {
    album: Album;
    artists: Artist[];
    //linked_from: {};
    popularity: number;
}