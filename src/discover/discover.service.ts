import { Injectable, Logger } from '@nestjs/common';
import { MinimalArtist } from 'src/queues/interface/artist-minimal.interface';
import { SpotifyPartnerService } from 'src/spotify-partner/spotify-partner.service';
import { ServiceBusReceiver } from '@azure/service-bus';
import { ArtistQueueService } from 'src/queues/artist-queue.service';
import { ArtistStat } from 'src/queues/interface/artist-stat.interface';
import { ArtistStatQueueService } from 'src/queues/artiststat-queue.service';

@Injectable()
export class DiscoverService {
    private readonly logger = new Logger(DiscoverService.name);

    constructor(
        private readonly spotifyPartnerService: SpotifyPartnerService,
        private readonly artistStatQueueService: ArtistStatQueueService,
        private readonly artistQueueService: ArtistQueueService,
    ) {}

    async populateQueueWithArtistsUriAndAlbumcount(listOfArtists: MinimalArtist[]): Promise<MinimalArtist[]> {
        this.logger.verbose(`Populating the artist queue with ${listOfArtists.length} artists`)
        let newListOfArtists: MinimalArtist[] = []
        listOfArtists.forEach( (artist) => {
            this.artistQueueService.sendMessages([artist])
            newListOfArtists.push(artist)
        })
        return newListOfArtists
    }

    async getArtistDailyStats(artist: MinimalArtist): Promise<ArtistStat> {
        this.logger.verbose(`Calling spotify API for artist data of '${artist.artistUri}'`)
        const overview = await this.spotifyPartnerService.getArtistData(artist.artistUri, false)
        const currentAlbumCount = overview.data.artistUnion.discography.albums.totalCount + overview.data.artistUnion.discography.singles.totalCount //+ overview.data.artistUnion.discography.compilations.totalCount
        return {
            uri: artist.artistUri,
            followers: overview.data.artistUnion.stats.followers,
            monthlyListeners: overview.data.artistUnion.stats.monthlyListeners,
            worldRank: overview.data.artistUnion.stats.worldRank,
            date: new Date(),
            albumCount: currentAlbumCount,
        }
    }

    initArtistQueueReceiver(): ServiceBusReceiver {
        this.logger.verbose(`Initialisation of a receiver for the artist queue`)
        return this.artistQueueService.addReceiver(async message => {
            //this.logger.verbose(`Received a messages from the artist queue containing ${message.body.length} albums`)
            message.body.forEach(async artist => {
                const artistStat = await this.getArtistDailyStats(artist)
                if (artistStat.albumCount > artist.albumCount) {
                    this.logger.verbose(`Must add ${artistStat.albumCount - artist.albumCount} album(s) to the db for '${artist.artistUri}'`)
                    //add the fucking missing albums
                }
                //this.artistStatQueueService.sendMessages([artistStat])
            })
        })
    }




}
