import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from 'src/entities/track.entity';
import { AlbumTrackItem } from 'src/interfaces/spotify/album.interface';
import { DataSource, In, Repository } from 'typeorm';
import { PlaycountDto } from './dto/playcount.dto';
import { PlaycountEntity } from 'src/entities/playcount.entity';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackEntity)
        private tracksRepository: Repository<TrackEntity>,

        @InjectRepository(PlaycountEntity)
        private playcountRepository: Repository<PlaycountEntity>,   

        private dataSource: DataSource,
      ) {}

    private readonly logger = new Logger(TrackService.name);

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
        this.logger.verbose(`Searching in the DB for the following track '${trackUri}'`)
        return await this.tracksRepository.findOneBy({ trackUri: trackUri });
    }

    async addPlaycount(playcountData: PlaycountDto[]) {
        let toReturn: Promise<PlaycountEntity>[] = []
        this.logger.verbose(`Adding playcount: ${playcountData.length}`)

        playcountData.forEach( async track => {
            const playcountEntity = new PlaycountEntity()
            playcountEntity.track = await this.findOneTrackByTrackUri(track.uri)
            playcountEntity.playcount = track.playcount
            playcountEntity.date = track.date
            toReturn.push(this.playcountRepository.save(playcountEntity))
        })
        return toReturn
    }

    async addManyPlaycount(playcountsData: PlaycountDto[]) {
        this.logger.verbose(`Adding playcount data for ${playcountsData.length} tracks`)
        await this.dataSource.createQueryBuilder()
            .insert()
            .into(PlaycountEntity)
            .values(await Promise.all(playcountsData.map(async playcount => ({
                track: await this.findOneTrackByTrackUri(playcount.uri),
                playcount: playcount.playcount,
                date: playcount.date,
            }))))
            .execute()
        return this.playcountRepository.find({
            where: {
                track: In(playcountsData.map(track => track.uri))
            }
        })
    }
}
