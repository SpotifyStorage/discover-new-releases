import { Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ArtistService } from 'src/artist/artist.service';
import { AbcService } from './abc.service';
import { MinimalArtist } from 'src/artist-queue/interface/artist-minimal.interface';

@Controller('abc')
export class AbcController {

    logger = new Logger(AbcController.name)
    
    constructor(
        private readonly artistService: ArtistService,
        private readonly abcService: AbcService,
    ) { }

    @Post('populate')
    @ApiOperation({ summary: "Add all the artists (uri + albumcount) to a queue" })
    async populateArtistQueue() {
        this.logger.verbose('Controller to populate artist queue has been called')
        const listOfArtist = await this.artistService.findAllArtistsUriAndAlbumCount()
        return this.abcService.populateQueueWithArtistsUriAndAlbumcount(listOfArtist)
    }
}
