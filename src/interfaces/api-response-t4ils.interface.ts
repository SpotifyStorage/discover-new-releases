import { Album } from "./spotify-api/album.interface";

export interface ApiResponseT4ils {
    success: boolean;
    data: Album;
}