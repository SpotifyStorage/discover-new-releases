import { Controller, Get, Logger, Query } from '@nestjs/common';
import { TrackService } from './track.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Track')
@Controller('track')
export class TrackController {
    constructor(
        private readonly trackService: TrackService,
    ) { }

    logger = new Logger(TrackController.name)

    @ApiQuery({ name: 'track_id' })
    @Get('')
    async findOneTrack(@Query('track_id') trackUri) {
        this.logger.verbose('Find one track by ID controller called')
        return await this.trackService.findOneTrackByTrackUri(trackUri)
    }



    // @Post('add/track')
    // async appendTracksFromArtist(@Query('artist') artistUri) {
    //   const tracks = await this.spotifyService.getTrackFromArtist(artistUri)

    //   for (var track of tracks) {
    //     this.trackService.addTrack(track)
    //   }
    //   return tracks
    // }
}
