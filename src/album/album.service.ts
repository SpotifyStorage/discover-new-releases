import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumEntity } from 'src/entities/album.entity';
import { TrackEntity } from 'src/entities/track.entity';
import { Album } from 'src/interfaces/spotify/album.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private albumRepository: Repository<AlbumEntity>,
        @InjectRepository(TrackEntity)
        private tracksRepository: Repository<TrackEntity>,

        private readonly artistService: ArtistService
    ) {}


    async findAllAlbumsUri() {
        return this.albumRepository.find({select: {albumUri: true}})
    }

    async addAlbum(album: Album) {
        const artist = await this.artistService.findOneArtistByArtistUri(album.artists[0].uri.split(":")[2])
        const albumEntity = new AlbumEntity()
        let tracks: TrackEntity[] = []
        // album.tracks.items.forEach(async track => {
        //     tracks.push(await this.addTrackWithoutAlbum(track))
        // });
        tracks = album.tracks.items.map((track) => {
            const trackEntity = new TrackEntity()
            trackEntity.name = track.name
            trackEntity.trackUri = track.uri.split(":")[2]
            return trackEntity
        })
        albumEntity.albumUri = album.id
        albumEntity.name = album.name
        albumEntity.tracks = tracks
        albumEntity.artist = artist
        return this.albumRepository.save(albumEntity)
    }

}
