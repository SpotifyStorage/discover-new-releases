import { Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArtistService } from 'src/artist/artist.service';
import { DiscoverService } from './discover.service';
import { MinimalArtist } from 'src/queues/interface/artist-minimal.interface';

@ApiTags('Discover')
@Controller('discover')
export class DiscoverController {

    logger = new Logger(DiscoverController.name)
    
    constructor(
        private readonly artistService: ArtistService,
        private readonly discoverService: DiscoverService,
    ) { }

    @Post('populate')
    @ApiOperation({ summary: "Add all the artists (uri + albumcount) to a queue" })
    async populateArtistQueue(): Promise<MinimalArtist[]> {
        this.logger.verbose('Controller to populate artist queue has been called')
        const listOfArtist = await this.artistService.findAllArtistsUriAndAlbumCount()
        return this.discoverService.populateQueueWithArtistsUriAndAlbumcount(listOfArtist)
    }
}
