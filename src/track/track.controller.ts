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



    @Get()
    findTrack(@Query('track') trackUri) {
      return this.trackService.findTrack(trackUri)
    }
    


    @ApiQuery({ name: 'track'})
    @Get('get_track')
    async findOneTrack(@Query('track') trackUri) {
      return await this.trackService.findOneTrackByTrackUri(trackUri)
    }

    @Post('playcount')
    appendPlaycountToDatabase(@Body() playcountData: PlaycountDto[]) {
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
