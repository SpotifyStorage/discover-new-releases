import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/entities/album.entity';
import { ArtistEntity } from 'src/entities/artist.entity';
import { TrackEntity } from 'src/entities/track.entity';
import { Album, AlbumTrackItem } from 'src/interfaces/spotify/album.interface';
import { Artist } from 'src/interfaces/spotify/artist.interface';
import { SpotifyService } from 'src/spotify/spotify.service';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackEntity)
        private tracksRepository: Repository<TrackEntity>,
        @InjectRepository(ArtistEntity)
        private artistRepository: Repository<ArtistEntity>,
        @InjectRepository(AlbumEntity)
        private albumRepository: Repository<AlbumEntity>,

        private readonly spotifyService: SpotifyService,
      ) {}

    async addTrackWithoutAlbum(track: AlbumTrackItem) {
        const foundTrack = await this.findOneTrackByTrackUri(track.uri)
        if (foundTrack != null) {
            return
        }
        const trackEntity = new TrackEntity()
        trackEntity.name = track.name
        trackEntity.trackUri = track.uri
        return this.tracksRepository.save(trackEntity)
    }

    async findOneTrackByTrackUri(trackUri: string): Promise<TrackEntity | null> {
        return this.tracksRepository.findOneBy({ trackUri: trackUri });
    }

    async findOneArtistByArtistUri(artistUri: string): Promise<ArtistEntity | null> {
        return this.artistRepository.findOneBy({ artistUri: artistUri });
    }

    async addArtist(artist: Artist) {
        // probleme: pas tous les artistes sont ajoutés
        artist.uri = artist.uri.split(":")[2]
        const foundArtist = await this.findOneArtistByArtistUri(artist.uri)
        console.log(foundArtist)
        if (foundArtist != null) {
            return
        }
        const artistEntity = new ArtistEntity()
        artistEntity.artistUri = artist.uri
        artistEntity.name = artist.name
        this.artistRepository.save(artistEntity)
    }

    async findTrack(trackUri: string) {
        return this.tracksRepository.findOne({
            where: {
                trackUri: trackUri,
            },
            // relations: {
            //     artist: true
            // }
        })
    }

    async findArtist(artistUri: string) {
        return this.artistRepository.findOne({
            where: {
                artistUri: artistUri
            },
            relations: {
                albums: {
                    tracks: true
                }
            }
        })
    }

    async addAlbum(album: Album) {
        const artist = await this.findOneArtistByArtistUri(album.artists[0].uri.split(":")[2])
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
        console.log(tracks)
        albumEntity.albumUri = album.id
        albumEntity.name = album.name
        albumEntity.tracks = tracks
        albumEntity.artist = artist
        return this.albumRepository.save(albumEntity)
    }

}
