import { ArtistStat } from "src/queues/interface/artist-stat.interface";
import { AlbumDto } from "src/spotify-partner/dto/album.dto";

export interface ArtistStatPreQueue extends ArtistStat {
    albumCount: number;
    discography: {
        singles: {
            totalCount: number;
            items: AlbumDto[]
        };
        albums: {
            totalCount: number;
            items: AlbumDto[]
        };
    };
}