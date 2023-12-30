import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { TrackService } from './track.service';
import { SpotifyService } from 'src/spotify/spotify.service';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlaycountDto } from './dto/playcount.dto';

@ApiTags('Track')
@Controller('track')
export class TrackController {
    constructor(
      private readonly trackService: TrackService,
    ) {}

    logger = new Logger(TrackController.name)

    @ApiQuery({ name: 'track_id'})
    @Get('')
    async findOneTrack(@Query('track_id') trackUri) {
      this.logger.verbose('Find one track by ID controller called')
      return await this.trackService.findOneTrackByTrackUri(trackUri)
    }

    @ApiBody({ type: [PlaycountDto] })
    @Post('playcount')
    appendPlaycountToDatabase(@Body() playcounts: PlaycountDto[]) {
      this.logger.verbose(`Add playcount to database controller called: ${playcounts.length}`)
      return this.trackService.addManyPlaycount(playcounts)

      //return this.trackService.addPlaycount(playcountData)
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
