import { ArtistSimplified } from "./artist-simplified.interface";

export interface Artist extends ArtistSimplified {
    genres: string[];
    image: {
        uri: string;
    };
}
