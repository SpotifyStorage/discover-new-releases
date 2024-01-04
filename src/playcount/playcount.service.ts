import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackStatsEntity } from 'src/entities/track-stats.entity';
import { TrackService } from 'src/track/track.service';
import { Between, DataSource, In, Repository } from 'typeorm';
import { PlaycountDto } from './dto/playcount.dto';
import { ResponseDto } from 'src/interfaces/dto/response.dto';

@Injectable()
export class PlaycountService {

    logger = new Logger(PlaycountService.name)

    constructor(
        @InjectRepository(TrackStatsEntity)
        private playcountRepository: Repository<TrackStatsEntity>,

        private readonly trackService: TrackService,
        private dataSource: DataSource
    ) {}

    async findPlaycountsByTrackUri(trackUri: string): Promise<ResponseDto<PlaycountDto[]>> {
        
        const trackObject = await this.trackService.findOneTrackByTrackUri(trackUri);

        if (trackObject) {
            this.logger.verbose(`Searching playcount data in the DB for the following track '${trackUri}'`)
            const playcountsData = await this.playcountRepository.find({
                where: {track: trackObject}
            })
            return {
                status: 'success',
                data: playcountsData.map(playcountData => ({
                    uri: trackUri,
                    playcount: playcountData.playcount,
                    date: playcountData.date
                }))
            }
        }

        this.logger.error(`The following track '${trackUri}' wasn't found in the DB`)
        
        return {
            status: 'failed'
        }
    }

    async findLatestPlaycountByTrackUri(trackUri: string): Promise<ResponseDto<PlaycountDto>> {
        
        const trackObject = await this.trackService.findOneTrackByTrackUri(trackUri);

        if (trackObject) {
            this.logger.verbose(`Searching latest playcount data in the DB for the following track '${trackUri}'`)
            const playcountData = await this.playcountRepository.findOne({
                where: {track: trackObject}, 
                order: {date: 'DESC'}
            })
            return {
                status: 'success',
                data: {
                    uri: trackUri,
                    playcount: playcountData.playcount,
                    date: playcountData.date
                }
            }
        }

        this.logger.error(`The following track '${trackUri}' wasn't found in the DB`)
        
        return {
            status: 'failed'
        }
    }

    async findOnePlaycountByDateAndTrackUri(trackUri: string, date: string | number): Promise<ResponseDto<PlaycountDto>> {
        
        const trackObject = await this.trackService.findOneTrackByTrackUri(trackUri);
        const dateBeginning = new Date(date)
        const dateEnd = new Date(dateBeginning.getTime() + 86400000)

        if (trackObject) {
            this.logger.verbose(`Searching playcount in the DB for the following track '${trackUri}' from ${date}`)
            const playcountData = await this.playcountRepository.findOneBy({
                track: trackObject, 
                date: Between(dateBeginning.getTime(), dateEnd.getTime())
            })
            return {
                status: 'success',
                data: {
                    uri: trackUri,
                    playcount: playcountData.playcount,
                    date: playcountData.date,
                }
            }
        }

        this.logger.error(`The following track '${trackUri}' wasn't found in the DB`)
        
        return {
            status: 'failed'
        }
    }

    async findPlaycountsByDatesAndTrackUri(trackUri: string, date: {start: string, end: string}): Promise<ResponseDto<PlaycountDto[] | string>> {
        
        const trackObject = await this.trackService.findOneTrackByTrackUri(trackUri);
        const dateBeginning = new Date(date.start)
        const dateEnd = new Date(new Date(date.end).getTime() + 86399999)

        if (trackObject) {
            this.logger.verbose(`Searching playcount in the DB for the following track '${trackUri}' between ${date.start} and ${date.end}`)
            const playcountsData = await this.playcountRepository.findBy({
                track: trackObject, 
                date: Between(dateBeginning.getTime(), dateEnd.getTime())
            })
            return {
                status: "success",
                data: playcountsData.map(playcountData => ({
                    uri: trackUri,
                    playcount: playcountData.playcount,
                    date: playcountData.date
                }))
            }
        }
        
        this.logger.error(`The following track '${trackUri}' wasn't found in the DB`)
        
        return {
            status: 'failed',
            data: 'Invalid query parameters or track is not yet registered in our database.'
        }
    }

    async addOnePlaycount(playcount: PlaycountDto): Promise<ResponseDto<PlaycountDto>> {

        this.logger.verbose(`Adding playcount data for the following track ${playcount.uri}`)

        const playcountEntity = new TrackStatsEntity()
        playcountEntity.track = await this.trackService.findOneTrackByTrackUri(playcount.uri)
        playcountEntity.playcount = playcount.playcount
        playcountEntity.date = playcount.date
        this.playcountRepository.save(playcountEntity)

        return this.findOnePlaycountByDateAndTrackUri(playcount.uri, playcount.date)
    }

    async addManyPlaycounts(playcountsData: PlaycountDto[]) {

        this.logger.verbose(`Adding playcount data for ${playcountsData.length} tracks`)

        await this.dataSource.createQueryBuilder()
            .insert()
            .into(TrackStatsEntity)
            .values(await Promise.all(playcountsData.map(async playcount => ({
                track: await this.trackService.findOneTrackByTrackUri(playcount.uri),
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

    async addFakeData() {
     
    }
}