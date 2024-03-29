import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumEntity } from 'src/entities/album.entity';
import { ArtistDataEntity } from 'src/entities/artist-data.entity';
import { TrackDataEntity } from 'src/entities/track-data.entity';
import { Album } from 'src/interfaces/spotify-api/album.interface';
import { AlbumDto } from 'src/spotify-partner/dto/album.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private albumRepository: Repository<AlbumEntity>,
        @InjectRepository(TrackDataEntity)
        private tracksRepository: Repository<TrackDataEntity>,

        //private readonly artistService: ArtistService
    ) { }

    logger = new Logger(AlbumService.name)

    async findAllAlbumsUri() {
        this.logger.verbose('Searching in the DB for all albums')
        return this.albumRepository.find({ select: { albumUri: true } })
    }

    async findArtistsOnAlbumByAlbumUri(albumUri: string): Promise<AlbumEntity> {
        this.logger.verbose(`Searching in the DB for the following album '${albumUri}'`)
        return this.albumRepository.findOne({
            where: {
                albumUri: albumUri
            },
            relations: {
                artists: true
            }
        })
    }

    findOneAlbumByUri(albumUri: string): Promise<AlbumEntity | null> {
        return this.albumRepository.findOne({
            where: {
                albumUri: albumUri
            },
            relations: {
                artists: true
            }
        })
    }

    async addOneAlbumWithKnownArtist(artist: ArtistDataEntity, album: AlbumDto) {
        //console.log(album)
        console.log('333')
        const currentAlbum = await this.findOneAlbumByUri(album.uri)
        console.log('444')
        if (currentAlbum) {
            this.logger.verbose(`Updating the following album '${album.uri}' with its new artist '${artist.artistUri}'`)
            console.log('oki')
            const artistsList = await this.findArtistsOnAlbumByAlbumUri(album.uri)
            console.log('2222')
            const albumEntity = new AlbumEntity()
            albumEntity.albumUri = album.uri
            albumEntity.name = album.name
            albumEntity.artists = []
            artistsList.artists.forEach((currentArtist) => {
                albumEntity.artists.push(currentArtist)
            })
            albumEntity.artists.push(artist)
            albumEntity.type = album.type
            albumEntity.tracks = album.tracks.map((track) => {
                const trackEntity = new TrackDataEntity()
                trackEntity.name = track.name
                trackEntity.trackUri = track.uri
                return trackEntity
            })
            
            await this.albumRepository.save(albumEntity)
            return currentAlbum
        } else {
            this.logger.verbose(`Adding the following album '${album.uri}' with its ${album.tracks.length} tracks to DB`)
            const albumEntity = new AlbumEntity()
            albumEntity.albumUri = album.uri
            albumEntity.name = album.name
            albumEntity.artists = [artist]
            albumEntity.type = album.type
            albumEntity.tracks = album.tracks.map((track) => {
                const trackEntity = new TrackDataEntity()
                trackEntity.name = track.name
                trackEntity.trackUri = track.uri
                return trackEntity
            })
            await this.albumRepository.save(albumEntity)
            return albumEntity
        }
    }
    // the following method is good but it cannot be dependent on artistService
    // must use eventEmitter instead : https://www.youtube.com/watch?v=-MlXwb42nKo&ab_channel=MariusEspejo

    // async addAlbum(album: Album) {
    //     this.logger.verbose(`Adding the following album '${album.uri}' to DB`)
    //     const artist = await this.artistService.findOneArtistByArtistUri(album.artists[0].uri.split(":")[2])
    //     const albumEntity = new AlbumEntity()
    //     let tracks: TrackDataEntity[] = []
    //     // album.tracks.items.forEach(async track => {
    //     //     tracks.push(await this.addTrackWithoutAlbum(track))
    //     // });
    //     tracks = album.tracks.items.map((track) => {
    //         const trackEntity = new TrackDataEntity()
    //         trackEntity.name = track.name
    //         trackEntity.trackUri = track.uri.split(":")[2]
    //         return trackEntity
    //     })
    //     albumEntity.albumUri = album.id
    //     albumEntity.name = album.name
    //     albumEntity.tracks = tracks
    //     albumEntity.artist = artist
    //     return this.albumRepository.save(albumEntity)
    // }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // async addOneAlbumByAlbumUri(albumUri: string) {
    //     this.logger.verbose(`Adding the following album '${albumUri}' to DB`)
    //     //const artist = await this.artistService.findOneArtistByArtistUri(album.artists[0].uri.split(":")[2])
    //     const albumEntity = new AlbumEntity()
    //     let tracks: TrackDataEntity[] = []
    //     tracks = album.tracks.items.map((track) => {
    //         const trackEntity = new TrackDataEntity()
    //         trackEntity.name = track.name
    //         trackEntity.trackUri = track.uri.split(":")[2]
    //         return trackEntity
    //     })
    //     albumEntity.albumUri = album.id
    //     albumEntity.name = album.name
    //     albumEntity.tracks = tracks
    //     albumEntity.artist = artist
    //     return this.albumRepository.save(albumEntity)
    // }

}
