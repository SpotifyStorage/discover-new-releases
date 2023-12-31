import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { stringify } from 'querystring';
import { lastValueFrom, map } from 'rxjs';
import { ArtistResponse } from 'src/interfaces/spotify-partner/artist-response.token';
import { TokenService } from 'src/token/token.service';
import { ArtistDto } from './dto';
import { AlbumDto } from './dto/album.dto';

@Injectable()
export class SpotifyPartnerService {
    logger = new Logger(SpotifyPartnerService.name)
    
    constructor(
        private readonly httpService: HttpService,
        private readonly tokenService: TokenService
    ) {}

    async getArtistData(artistUid: string): Promise<ArtistResponse> {
        
        this.logger.verbose('Calling spotify API for artist data')
    
        const payload = {
          'operationName': 'queryArtistOverview',
          'variables': JSON.stringify({
              "uri": `spotify:artist:${artistUid}`,
              "locale": "",
              "includePrerelease": true
          }),
          'extensions': JSON.stringify({
              "persistedQuery": {
                  "version": 1,
                  "sha256Hash": "35648a112beb1794e39ab931365f6ae4a8d45e65396d641eeda94e4003d41497"
              }
          })
        }
    
        const header = {
          'accept': 'application/json',
          'app-platform': 'WebPlayer',
          'content-type': 'application/json',
          'origin': 'https://open.spotify.com',
          'referer': 'https://open.spotify.com/',
          'spotify-app-version': '1.2.15.275.g634be5e0',
          'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
          'authorization': `Bearer ${(await this.tokenService.getValidPartnerToken()).accessToken}`
        }
    
        return lastValueFrom(
            this.httpService
                .get<ArtistResponse>('https://api-partner.spotify.com/pathfinder/v1/query?' + stringify(payload), {headers: header})
                .pipe(
                    map(
                        axiosResponse => axiosResponse.data
                    )
                )
        )
    }

    

    async getArtistDataDto(artistUid: string): Promise<ArtistDto> {
        const artistData = await this.getArtistData(artistUid)
        try {
            return {
                uri: artistUid,
                name: artistData.data.artistUnion.profile.name,
                follower: artistData.data.artistUnion.stats.followers,
                monthlyListener: artistData.data.artistUnion.stats.monthlyListeners,
                worldRank: artistData.data.artistUnion.stats.worldRank,
                albums: artistData.data.artistUnion.discography.popularReleasesAlbums.items.map(x => ({
                    name: x.name,
                    uri: x.id
                }))
            }
        } catch {
            this.logger.error('Invalid response from spotify-partner getArtist endpoint, artistUri is probably wrong')
        }
    }
}
