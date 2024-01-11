import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/entities/album.entity';
import { ArtistDataEntity } from 'src/entities/artist-data.entity';
import { TrackDataEntity } from 'src/entities/track-data.entity';
import { Artist } from 'src/interfaces/spotify-api/artist.interface';
import { SpotifyApiService } from 'src/spotify-api/spotify-api.service';
import { ArtistDto } from 'src/spotify-partner/dto';
import { artistToEntity } from 'src/utilities/artist.utilities';
import { DataSource, In, Like, Repository } from 'typeorm';
import { ArtistsUriDto } from './dto/artists-uri.dto';
import { SpotifyPartnerService } from 'src/spotify-partner/spotify-partner.service';
import { MinimalArtist } from 'src/queues/interface/artist-minimal.interface';

@Injectable()
export class ArtistService {
    constructor(
        @InjectRepository(ArtistDataEntity)
        private artistDataRepository: Repository<ArtistDataEntity>,

        @InjectRepository(AlbumEntity)
        private albumRepository: Repository<AlbumEntity>,
        
        private dataSource: DataSource,
        private readonly spotifyApiService: SpotifyApiService,
        private readonly spotifyPartnerService: SpotifyPartnerService
    ) {}
    logger = new Logger(ArtistService.name);

    async findOneArtistByArtistUri(artistUri: string): Promise<ArtistDataEntity | null> {
        return this.artistDataRepository.findOneBy({ artistUri: artistUri });
    }

    async addManyArtists(artists: Artist[]): Promise<ArtistDataEntity[]> {
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

    async findOneArtist(artistUri: string): Promise<ArtistDataEntity> {
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

        const artistData = await this.spotifyPartnerService.getArtistDataDto(artistUri)

        const artistEntity = new ArtistDataEntity()

        for (var album of artistData.albums) {
            album.tracks = await this.spotifyApiService.getTracksDtoFromAlbum(album.uri)
        }

        artistEntity.artistUri = artistData.uri
        artistEntity.name = artistData.name
        artistEntity.albums = await Promise.all(artistData.albums.map(async (album) => {
            this.logger.verbose(`Adding the following album '${album.uri}' with its ${album.tracks.length} tracks to DB`)
            const albumEntity = new AlbumEntity()
            albumEntity.albumUri = album.uri
            albumEntity.name = album.name
            albumEntity.type = album.type
            albumEntity.tracks = album.tracks.map((track) => {
                const trackEntity = new TrackDataEntity()
                trackEntity.name = track.name
                trackEntity.trackUri = track.uri
                return trackEntity
            })
            try {
                await this.albumRepository.save(albumEntity)
            } catch (err) {
                this.logger.error(err)
            }
            return albumEntity
        }))

        await this.artistDataRepository.save(artistEntity)

        return this.findOneArtistByArtistUri(artistData.uri)
    }

    async findAllArtistsUri(): Promise<ArtistsUriDto[]> {
        this.logger.verbose("Getting all artists' uri in the database")
        const artistsUri = await this.artistDataRepository.find({select: {artistUri: true}})
        return artistsUri.map(artist => ({
            uri: artist.artistUri
        }))
    }

    async findAllArtistsUriAndAlbumCount(): Promise<MinimalArtist[]> {
        this.logger.verbose("Getting all artists' uri and album count in the database")
        
        const artistsUri = await this.artistDataRepository.find({
            select: {artistUri: true, albums: true}, 
            relations: {albums: true},
        })
        
        return artistsUri.map(artist => {
            let singleCount = 0, albumCount = 0
            artist.albums.forEach( (album) => {
                if (album.type == 'SINGLE') {singleCount++}
                else if (album.type == 'ALBUM') {albumCount++}
            })
            return {
                artistUri: artist.artistUri,
                totalCount: artist.albums.length,
                singleCount: singleCount,
                albumCount: albumCount,
            }
        })
    }

    async test(x: any) {
        return {uri: x}
    }

    async addManyArtistsByUri(listOfArtists: ArtistsUriDto[]): Promise<ArtistDataEntity[]> {
        let toReturn = []
        for (var artist of listOfArtists) {
            toReturn.push(await this.addOneArtist(artist.uri))
        }
        return toReturn
    }

    async deleteOneArtist(artistUri) {
        // must add the onDelete: "CASCADE" property ti the artist's entity

        await this.dataSource
            .createQueryBuilder()
            .delete()
            .from(ArtistDataEntity)
            .where("artist_uri = :uri", {uri: artistUri})
            .execute()
        return this.artistDataRepository.find()

    }

    async searchArtists(artistName: string): Promise<ArtistDataEntity[]> {
        return await this.artistDataRepository.find({
            where: {name: Like(`%${artistName.split('').join('%')}%`)},
            take: 10
            //select: {name: true}
        })
    }
}
