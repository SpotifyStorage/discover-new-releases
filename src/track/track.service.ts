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
        return await this.tracksRepository.findOneBy({ trackUri: trackUri });
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





    async addPlaycount(playcountData: PlaycountDto[]) {
        let toReturn: Promise<PlaycountEntity>[] = []
        console.log('cocombre')

        playcountData.forEach( async track => {
            const playcountEntity = new PlaycountEntity()
            console.log("URI", track.uri)
            console.log("Track", await this.findOneTrackByTrackUri(track.uri))
            playcountEntity.track = await this.findOneTrackByTrackUri(track.uri)
            playcountEntity.playcount = track.playcount.toString()
            playcountEntity.date = track.date.toString()
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
