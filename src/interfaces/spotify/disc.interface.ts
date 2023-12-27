import { Track } from "./track.interface";

export interface Disc {
    number: number;
    name: string;
    tracks: Track[];
}