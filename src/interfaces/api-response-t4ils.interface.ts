import { Album } from "./spotify/album.interface";

export interface ApiResponseT4ils {
    success: boolean;
    data: Album;
}