import { Injectable, Logger } from '@nestjs/common';
import { MinimalArtist } from 'src/queues/interface/artist-minimal.interface';
import { SpotifyPartnerService } from 'src/spotify-partner/spotify-partner.service';
import { ServiceBusReceiver } from '@azure/service-bus';
import { ArtistQueueService } from 'src/queues/artist-queue.service';
import { ArtistStat } from 'src/queues/interface/artist-stat.interface';
import { ArtistStatQueueService } from 'src/queues/artiststat-queue.service';
import { ArtistStatPreQueue } from './interface/artiststat-prequeue.interface';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { SpotifyApiService } from 'src/spotify-api/spotify-api.service';

@Injectable()
export class DiscoverService {
    private readonly logger = new Logger(DiscoverService.name);

    constructor(
        private readonly spotifyPartnerService: SpotifyPartnerService,
        private readonly spotifyApiService: SpotifyApiService,
        private readonly artistStatQueueService: ArtistStatQueueService,
        private readonly artistQueueService: ArtistQueueService,
        private readonly artistService: ArtistService,
        private readonly albumService: AlbumService,
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

    async getArtistDailyStats(artist: MinimalArtist): Promise<ArtistStatPreQueue> {
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
            discography: {
                singles: {
                    totalCount: overview.data.artistUnion.discography.singles.totalCount,
                    items: overview.data.artistUnion.discography.singles.items.map( (single) => ({
                        uri: single.releases.items[0].uri,
                        name: single.releases.items[0].name,
                    })),
                },
                albums: {
                    totalCount: overview.data.artistUnion.discography.albums.totalCount,
                    items: overview.data.artistUnion.discography.albums.items.map( (album) => ({
                        uri: album.releases.items[0].uri,
                        name: album.releases.items[0].name,
                    })),
                },
            }
        }
    }

    initArtistQueueReceiver(): ServiceBusReceiver {
        this.logger.verbose(`Initialisation of a receiver for the artist queue`)
        return this.artistQueueService.addReceiver(async message => {
            this.logger.verbose(`Received a messages from the artist queue containing ${message.body.length} albums`)
            message.body.forEach(async artist => {
                const artistStat = await this.getArtistDailyStats(artist)
                this.checkForMissingAlbums(artist, artistStat)
                //this.artistStatQueueService.sendMessages([artistStat])
            })
        })
    }

    
    checkForMissingAlbums(artist: MinimalArtist, artistStat: ArtistStatPreQueue) {
        if (artistStat.albumCount > artist.albumCount) {
            this.logger.verbose(`Must add ${artistStat.albumCount - artist.albumCount} album(s) to the db for '${artist.artistUri}'`)
            if (artistStat.discography.albums.totalCount <= 10) {
                this.logger.verbose('Can add an album from the data.')
                artistStat.discography.albums.items.forEach( async (album) => {
                    console.log(await this.albumService.findOneAlbumByUri(album.uri))
                    if (! await this.albumService.findOneAlbumByUri(album.uri)) {
                        this.logger.warn(album.uri)
                        const artist = await this.artistService.findOneArtistByArtistUri(artistStat.uri)
                        //this.albumService.addOneAlbumWithoutTracks(artist, album)
                    }
                })
            } else if (artistStat.discography.singles.totalCount <= 10) {
                this.logger.verbose('Can add a single from the data.')
                artistStat.discography.singles.items.forEach( async (single) => {
                    if (!this.albumService.findOneAlbumByUri(single.uri)) {
                        console.log(single.uri)
                        const artist = await this.artistService.findOneArtistByArtistUri(artistStat.uri)
                        //this.albumService.addOneAlbumWithoutTracks(artist, album)
                    }
                })
            }
            //sinon il faut recall spotify
        } 
    }




}
