import { Injectable, Logger } from '@nestjs/common';
import { ArtistQueueService } from 'src/artist-queue/artist-queue.service';
import { MinimalArtist } from 'src/artist-queue/interface/artist-minimal.interface';
import { SpotifyPartnerService } from 'src/spotify-partner/spotify-partner.service';
import { ArtistStatQueueMessageBody } from './dto/artist-daily.interface';

@Injectable()
export class AbcService {
    private readonly logger = new Logger(AbcService.name);

    constructor(
        private readonly artistQueueService: ArtistQueueService,
        private readonly spotifyPartnerService: SpotifyPartnerService,
    ) {}

    async populateQueueWithArtistsUriAndAlbumcount(listOfArtist: MinimalArtist[]) {
        this.logger.verbose(`Populating the artist queue with ${listOfArtist.length} artists`)
        listOfArtist.forEach( (artist) => {
            console.log(artist)
            this.artistQueueService.sendMessages([artist])
        })
    }

    async getArtistDailyStats(artist: MinimalArtist): Promise<ArtistStatQueueMessageBody> {
        const data = await this.spotifyPartnerService.getArtistData(artist.artistUri)
        return {
            uri: artist.artistUri,
            followers: data.data.artistUnion.stats.followers,
            monthlyListeners: data.data.artistUnion.stats.monthlyListeners,
            worldRank: data.data.artistUnion.stats.worldRank,
            date: new Date()
        }
    }


}
