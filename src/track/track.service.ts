import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/entities/album.entity';
import { ArtistEntity } from 'src/entities/artist.entity';
import { TrackEntity } from 'src/entities/track.entity';
import { Album, AlbumTrackItem } from 'src/interfaces/spotify/album.interface';
import { Artist } from 'src/interfaces/spotify/artist.interface';
import { SpotifyService } from 'src/spotify/spotify.service';
import { DataSource, In, Repository } from 'typeorm';
import { PlaycountDto } from './dto/playcount.dto';
import { PlaycountEntity } from 'src/entities/playcount.entity';
import { artistToEntity } from 'src/utilities/artist.utilities';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackEntity)
        private tracksRepository: Repository<TrackEntity>,
        @InjectRepository(ArtistEntity)
        private artistRepository: Repository<ArtistEntity>,
        @InjectRepository(AlbumEntity)
        private albumRepository: Repository<AlbumEntity>,
        @InjectRepository(PlaycountEntity)
        private playcountRepository: Repository<PlaycountEntity>,        
        private dataSource: DataSource,
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

    async addManyArtists(artists: Artist[]) {
        console.log(artists)
        let uniqueArtist = artists
        const existingArtists = await this.artistRepository.find({
            where: {
                artistUri: In(artists.map(artist => artist.id))
            }
        })
        if (existingArtists.length > 0) {
            uniqueArtist = artists.filter(artist => 
                (existingArtists.find(existingArtist => existingArtist.artistUri == artist.id)) == null
            )
        }
        await this.dataSource.createQueryBuilder()
            .insert()
            .into(ArtistEntity)
            .values(uniqueArtist.map(artist => {
                return artistToEntity(artist)
            }))
            .execute()
        return this.artistRepository.find({
            where: {
                artistUri: In(artists.map(artist => artist.id))
            }
        })
    }

    async addArtist(artist: Artist) {
        // probleme: pas tous les artistes sont ajoutés
        artist.uri = artist.id
        const foundArtist = await this.findOneArtistByArtistUri(artist.uri)
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

    async findOneArtist(artistUri: string) {
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

    async findAllAlbumsUri() {
        return this.albumRepository.find({select: {albumUri: true}})
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
        albumEntity.albumUri = album.id
        albumEntity.name = album.name
        albumEntity.tracks = tracks
        albumEntity.artist = artist
        return this.albumRepository.save(albumEntity)
    }

    async addPlaycount(playcountData: PlaycountDto[]) {
        let toReturn: Promise<PlaycountEntity>[] = []
        console.log('cocombre')

        playcountData.forEach( async track => {
            const playcountEntity = new PlaycountEntity()
            playcountEntity.track = await this.findOneTrackByTrackUri(track.uri)
            playcountEntity.playcount = track.playcount.toString()
            playcountEntity.date = track.date.toString()
            console.log('patate')
            toReturn.push(this.playcountRepository.save(playcountEntity))
        })
        return toReturn
    }

    async addManyPlaycount(playcountsData: PlaycountDto[]) {
        console.log(playcountsData)

        await this.dataSource.createQueryBuilder()
            .insert()
            .into(PlaycountEntity)
            .values(await Promise.all(playcountsData.map(async playcount => ({
                track: await this.findOneTrackByTrackUri(playcount.uri),
                playcount: playcount.playcount.toString(),
                date: playcount.date.toString(),
            }))))
            .execute()
        return this.playcountRepository.find({
            where: {
                track: In(playcountsData.map(track => track.uri))
            }
        })
    }
}
