import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaycountEntity } from 'src/entities/playcount.entity';
import { TrackService } from 'src/track/track.service';
import { Between, Repository } from 'typeorm';
import { PlaycountDto } from './dto/playcount.dto';
import { ResponseDto } from 'src/interfaces/dto/response.dto';

@Injectable()
export class PlaycountService {

    logger = new Logger(PlaycountService.name)

    constructor(
        @InjectRepository(PlaycountEntity)
        private playcountRepository: Repository<PlaycountEntity>,

        private readonly trackService: TrackService
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

    async findOnePlaycountByDateAndTrackUri(trackUri: string, date: string): Promise<ResponseDto<PlaycountDto>> {
        
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
        const dateEnd = new Date(date.end)

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
}