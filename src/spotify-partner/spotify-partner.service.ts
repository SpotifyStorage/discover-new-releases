import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { stringify } from 'querystring';
import { catchError, lastValueFrom, map } from 'rxjs';
import { ArtistResponse } from 'src/interfaces/spotify-partner/artist-response.interface';
import { TokenService } from 'src/token/token.service';
import { ArtistDto } from './dto';
import { AlbumDto } from './dto/album.dto';
import { ArtistAlbumsResponse } from 'src/interfaces/spotify-partner/artist-albums-response.interface';

@Injectable()
export class SpotifyPartnerService {
    logger = new Logger(SpotifyPartnerService.name)
    
    constructor(
        private readonly httpService: HttpService,
        private readonly tokenService: TokenService
    ) {}

    async getValidHeader() {
        return {
            'accept': 'application/json',
            'app-platform': 'WebPlayer',
            'content-type': 'application/json',
            'origin': 'https://open.spotify.com',
            'referer': 'https://open.spotify.com/',
            'spotify-app-version': '1.2.15.275.g634be5e0',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            'authorization': `Bearer ${(await this.tokenService.getValidPartnerToken()).accessToken}`
        }
    }
    async getArtistData(artistUri: string, logger: boolean = true): Promise<ArtistResponse> {
        
        logger ? this.logger.verbose(`Calling spotify API for artist data of '${artistUri}'`) : null;
    
        const payload = {
          'operationName': 'queryArtistOverview',
          'variables': JSON.stringify({
              "uri": `spotify:artist:${artistUri}`,
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
    
        return lastValueFrom(
            this.httpService
                .get<ArtistResponse>('https://api-partner.spotify.com/pathfinder/v1/query?' + stringify(payload), {headers: await this.getValidHeader()})
                .pipe(
                    map(
                        axiosResponse => axiosResponse.data
                    ),
                    catchError(
                        (err) => {
                            this.logger.error(err.response.data)
                            throw new HttpException(err.message, err.response.status)
                        }
                    )
                )
        )
    }

    async getArtistAlbums(artistUri: string): Promise<ArtistAlbumsResponse> {

        this.logger.verbose("Calling spotify API for artist's albums")

        const payload = {
            'operationName': 'queryArtistDiscographyAll',
            'variables': JSON.stringify({
                "uri": `spotify:artist:${artistUri}`,
                "offset": 0,
                "limit": 115 //TODO: check if totalcount is greater then 115 (115 is the limit, otherwise their is an error thrown by the spotify api)
            }),
            'extensions': JSON.stringify({
                "persistedQuery": {
                    "version": 1,
                    "sha256Hash": "3f1c940cde61596bf4f534e5a736e6fac24d2a792cc81852820e20a93863a2b5"
                }
            })
          }
      
          return lastValueFrom(
              this.httpService
                  .get<ArtistAlbumsResponse>('https://api-partner.spotify.com/pathfinder/v1/query?' + stringify(payload), {headers: await this.getValidHeader()})
                  .pipe(
                      map(
                          axiosResponse => axiosResponse.data
                      )
                  )
          )
    }

    

    async getArtistDataDto(artistUri: string): Promise<ArtistDto> {
        const artistData = await this.getArtistData(artistUri)

        try {
            return {
                uri: artistUri,
                name: artistData.data.artistUnion.profile.name,
                follower: artistData.data.artistUnion.stats.followers,
                monthlyListener: artistData.data.artistUnion.stats.monthlyListeners,
                worldRank: artistData.data.artistUnion.stats.worldRank,
                albums: await this.getArtistAlbumsDto(artistUri)
                // albums: artistData.data.artistUnion.discography.popularReleasesAlbums.items.map(x => ({
                //     name: x.name,
                //     uri: x.id
                // }))
            }
        } catch {
            this.logger.error('Invalid response from spotify-partner getArtist endpoint, artistUri is probably wrong')
        }
    }

    async getArtistAlbumsDto(artistUri: string): Promise<AlbumDto[]> {
        
        const artistAlbumsData = await this.getArtistAlbums(artistUri)
        
        try {
            return artistAlbumsData.data.artistUnion.discography.all.items.map(album => ({
                uri: album.releases.items[0].id,
                name: album.releases.items[0].name
            }))
        } catch {
            this.logger.error('Invalid response from spotify-partner getArtist endpoint, artistUri is probably wrong')
        }
    }
}



//.data.artistUnion.discography.all.items.map()
