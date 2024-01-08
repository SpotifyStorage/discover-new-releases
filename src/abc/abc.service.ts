import { Injectable, Logger } from '@nestjs/common';
import { ArtistQueueService } from 'src/artist-queue/artist-queue.service';
import { MinimalArtist } from 'src/artist-queue/interface/artist-minimal.interface';
import { SpotifyPartnerService } from 'src/spotify-partner/spotify-partner.service';
import { ArtistStatQueueMessageBody } from './dto/artist-daily.interface';
import { ServiceBusReceiver } from '@azure/service-bus';

@Injectable()
export class AbcService {
    private readonly logger = new Logger(AbcService.name);

    constructor(
        private readonly spotifyPartnerService: SpotifyPartnerService,
        private readonly artistQueueService: ArtistQueueService,
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

    initArtistQueueReceiver(): ServiceBusReceiver {
        this.logger.verbose(`Initialisation of a receiver for the artist queue`)
        return this.artistQueueService.addReceiver(async message => {
            //this.logger.verbose(`Received a messages from the artist queue containing ${message.body.length} albums`)
            message.body.forEach(async artist => {
                const newMessage = await this.getArtistDailyStats(artist)
                console.log(newMessage)
            })
        })
    }


}
