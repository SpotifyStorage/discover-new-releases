import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { TrackService } from './track.service';
import { SpotifyService } from 'src/spotify/spotify.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlaycountDto } from './dto/playcount.dto';

@ApiTags('Track')
@Controller('track')
export class TrackController {
    constructor(
      private readonly trackService: TrackService,
      private readonly spotifyService: SpotifyService
    ) {}

    logger = new Logger(TrackController.name)

    @ApiQuery({ name: 'track_id'})
    @Get('')
    async findOneTrack(@Query('track_id') trackUri) {
      this.logger.verbose('Find one track by ID controller called')
      return await this.trackService.findOneTrackByTrackUri(trackUri)
    }

    @Post('playcount')
    appendPlaycountToDatabase(@Body() playcountData: PlaycountDto[]) {
      this.logger.verbose('Append to DB playcount data controller called')
      return this.trackService.addManyPlaycount(playcountData)

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
