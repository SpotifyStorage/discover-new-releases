import { Body, Controller, Get, Logger, Param, Post, Query } from '@nestjs/common';
import { PlaycountService } from './playcount.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlaycountDto } from './dto/playcount.dto';

@ApiTags('PlaycountArtist')
@Controller('playcount/artist')
export class PlaycountArtistController {
    private readonly logger = new Logger(PlaycountArtistController.name);

    constructor(
        private readonly playcountService: PlaycountService
    ) { }

    @Get('latest')
    @ApiQuery({ name: 'trackId' })
    @ApiOperation({ summary: 'Get the most recent playcount data of one track from the database' })
    async findLatestPlaycountByTrackUri(@Query('trackId') trackUri) {
        this.logger.verbose('Get latest playcount by track controller called');
        return await this.playcountService.findLatestPlaycountByTrackUri(trackUri)
    }

    @Get('specificTime')
    @ApiQuery({ name: 'trackId' })
    @ApiQuery({ name: 'date' })
    @ApiOperation({ summary: 'Get the playcount data of one track at a spefic date from the database' })
    async findOnePlaycountByDateAndTrackUri(@Query('trackId') trackUri, @Query('date') date) {
        this.logger.verbose('Get specifically dated playcount by track controller called');
        return this.playcountService.findOnePlaycountByDateAndTrackUri(trackUri, date)
    }

    @Get('timeWindow')
    @ApiQuery({ name: 'trackId' })
    @ApiQuery({ name: 'from' })
    @ApiQuery({ name: 'to' })
    @ApiOperation({ summary: 'Get all playcount data of one track in specific time window from the database' })
    async findPlaycountsByDatesAndTrackUri(@Query('trackId') trackUri, @Query('from') fromDate, @Query('to') toDate) {
        this.logger.verbose('Called -> get playcount by track between two dates');
        return this.playcountService.findPlaycountsByDatesAndTrackUri(trackUri, { start: fromDate, end: toDate })
    }

    @Get(':artistId')
    @ApiParam({ name: 'artistId' })
    @ApiOperation({ summary: 'Get all playcount data of one track from the database' })
    async findPlaycountsByTrackUri(@Param('artistId') artistUri) {
        this.logger.verbose(`Get playcount by track controller called for ${artistUri}`);
        return await this.playcountService.findPlaycountsByTrackUri(artistUri)
    }
}
