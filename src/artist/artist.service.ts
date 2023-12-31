import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { AlbumService } from 'src/album/album.service';
import { AlbumEntity } from 'src/entities/album.entity';
import { ArtistDataEntity } from 'src/entities/artist-data.entity';
import { TrackDataEntity } from 'src/entities/track-data.entity';
import { Artist } from 'src/interfaces/spotify-api/artist.interface';
import { SpotifyApiService } from 'src/spotify-api/spotify-api.service';
import { SpotifyPartnerService } from 'src/spotify-partner/spotify-partner.service';
import { artistToEntity } from 'src/utilities/artist.utilities';
import { Connection, DataSource, In, Repository } from 'typeorm';

@Injectable()
export class ArtistService {
    constructor(
        @InjectRepository(ArtistDataEntity)
        private artistDataRepository: Repository<ArtistDataEntity>,

        @InjectRepository(AlbumEntity)
        private albumRepository: Repository<AlbumEntity>,

        @InjectConnection() private readonly connection: Connection,
        
        private dataSource: DataSource,
        private readonly spotifyApiService: SpotifyApiService,
        private readonly spotifyPartnerService: SpotifyPartnerService,
        private readonly albumService: AlbumService,
    ) {}
    logger = new Logger(ArtistService.name);

    async findOneArtistByArtistUri(artistUri: string): Promise<ArtistDataEntity | null> {
        return this.artistDataRepository.findOneBy({ artistUri: artistUri });
    }

    async addManyArtists(artists: Artist[]) {
        this.logger.verbose(`Adding ${artists.length} artists`)
        let uniqueArtist = artists
        const existingArtists = await this.artistDataRepository.find({
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
            .into(ArtistDataEntity)
            .values(uniqueArtist.map(artist => {
                return artistToEntity(artist)
            }))
            .execute()
        return this.artistDataRepository.find({
            where: {
                artistUri: In(artists.map(artist => artist.id))
            }
        })
    }

    // async addOneArtist(artist: Artist) {
    //     // probleme: pas tous les artistes sont ajoutés
    //     artist.uri = artist.id
    //     const foundArtist = await this.findOneArtistByArtistUri(artist.uri)
    //     if (foundArtist != null) {
    //         return
    //     }
    //     const artistEntity = new ArtistDataEntity()
    //     artistEntity.artistUri = artist.uri
    //     artistEntity.name = artist.name
    //     this.artistRepository.save(artistEntity)
    // }

    async findOneArtist(artistUri: string) {
        return this.artistDataRepository.findOne({
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

    async addOneArtist(artistUri: string): Promise<ArtistDataEntity> {

        const artistEntity = new ArtistDataEntity()

        const artistData = await this.spotifyPartnerService.getArtistDataDto(artistUri)
        for (var album of artistData.albums) {
            const tracks = await this.spotifyApiService.getTracksDtoFromAlbum(album.uri)
            album.tracks = tracks
        }

        artistEntity.artistUri = artistUri
        artistEntity.name = artistData.name
        artistEntity.albums = artistData.albums.map((album) => {
            this.logger.verbose(`Adding the following album '${album.uri}' with its ${album.tracks.length} tracks to DB`)
            const albumEntity = new AlbumEntity()
            albumEntity.albumUri = album.uri
            albumEntity.name = album.name
            albumEntity.tracks = album.tracks.map((track) => {
                const trackEntity = new TrackDataEntity()
                trackEntity.name = track.name
                trackEntity.trackUri = track.uri
                return trackEntity
            })
            this.albumRepository.save(albumEntity)
            return albumEntity
        })

        this.artistDataRepository.save(artistEntity)

        return this.findOneArtistByArtistUri(artistUri)
    }

    // async findAllArtistsUri() {
    //     this.logger.verbose('Searching in the DB for all artists!')
    //     const resp = this.connection.query('SELECT * FROM artist_data')
    //     console.log(resp)
    //     return resp
    // }

    async findAllArtistsUri(): Promise<{artistUri: string}[]> {
        this.logger.verbose("Getting all artists' uri in the database")
        return this.artistDataRepository.find({select: {artistUri: true}})
    }
}
