import { Controller, Get, Logger, Query } from '@nestjs/common';
import { PlaycountService } from './playcount.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Playcount')
@Controller('playcount')
export class PlaycountController {
    private readonly logger = new Logger(PlaycountController.name);

    constructor(
      private readonly playcountService: PlaycountService
    ) {}

    @ApiQuery({ name: 'trackId'})
    @Get('')
    async findPlaycountsByTrackUri(@Query('trackId') trackUri) {
        this.logger.verbose('Get playcount by track controller called');
        return await this.playcountService.findPlaycountsByTrackUri(trackUri)
    }

    @ApiQuery({ name: 'trackId'})
    @Get('latest')
    async findLatestPlaycountByTrackUri(@Query('trackId') trackUri) {
        this.logger.verbose('Get latest playcount by track controller called');
        return await this.playcountService.findLatestPlaycountByTrackUri(trackUri)
    }

    @ApiQuery({ name: 'trackId'})
    @ApiQuery({ name: 'date'})
    @Get('date')
    async findOnePlaycountByDateAndTrackUri(@Query('trackId') trackUri, @Query('date') date) {
        this.logger.verbose('Get specifically dated playcount by track controller called');
        return this.playcountService.findOnePlaycountByDateAndTrackUri(trackUri, date)
    }
    
    @ApiQuery({ name: 'trackId'})
    @ApiQuery({ name: 'from'})
    @ApiQuery({ name: 'to'})
    @Get('dates')
    async findPlaycountsByDatesAndTrackUri(@Query('trackId') trackUri, @Query('from') fromDate, @Query('to') toDate) {
        this.logger.verbose('Called -> get playcount by track between two dates');
        return this.playcountService.findPlaycountsByDatesAndTrackUri(trackUri, {start: fromDate, end: toDate})
    }
}
