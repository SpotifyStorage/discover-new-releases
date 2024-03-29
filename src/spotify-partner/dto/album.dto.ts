import { TrackDto } from "./track.dto";

export interface AlbumDto {
    uri: string;
    name: string;
    type: string;
    tracks?: TrackDto[];
}