import { AlbumDto } from "./album.dto";

export interface ArtistDto {
    uri: string;
    name: string;
    follower: number;
    monthlyListener: number;
    worldRank: number;
    albums: AlbumDto[]
}