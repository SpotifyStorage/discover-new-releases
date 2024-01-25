import { HttpException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { ApiResponseT4ils } from '../interfaces/api-response-t4ils.interface';
import { Playlist } from 'src/interfaces/spotify-api/playlist.interface';
import { Album } from 'src/interfaces/spotify-api/album.interface';
import { AlbumSimplified } from 'src/interfaces/spotify-api/album-simplified.interface';
import { TokenService } from 'src/token/token.service';
import { AlbumDto } from 'src/spotify-partner/dto/album.dto';
import { SpotifyResponse } from 'src/interfaces/spotify-api/response.interface';
import { TrackDto } from 'src/spotify-partner/dto/track.dto';

@Injectable()
export class SpotifyApiService {

    logger = new Logger(SpotifyApiService.name)

    constructor(
        private readonly httpService: HttpService,
        private readonly tokenService: TokenService,

    ) { }

    async callAlbumFromArtist(artistURI: string = '5eAWCfyUhZtHHtBdNk56l1') {
        const token = (await this.tokenService.getValidApiToken()).access_token
        const header = { 'Authorization': `Bearer ${token}` };
        const url = `https://api.spotify.com/v1/artists/${artistURI}/albums`
        this.logger.verbose(`Getting albums from artist ${artistURI}`)
        //const header = {"Authorization" : `Bearer ${tokenStr}`}}

        return lastValueFrom(
            this.httpService
                .get<ApiResponseT4ils>(url, { headers: header })
                .pipe(
                    map(
                        axiosResponse => axiosResponse.data
                    ),
                    catchError(async (err) => {
                        if (err.response.status == 429) {
                            this.logger.error("429 code while fetching for album's tracks, waiting 10 seconds...")
                            await new Promise(f => setTimeout(f, 10000))
                            this.logger.warn('Trying again...')
                            return this.callAlbumFromArtist(artistURI)
                        }
                        this.logger.error(`An error occured while fetching spotify-api at ${url}`)
                        this.logger.error(err.response.data)
                        this.logger.debug(header, url)
                        throw new HttpException(err.message, err.response.status)
                    })
                )
        )
    }

    async getPlaylistTrackItems(playlistURI: string) {
        const token = (await this.tokenService.getValidApiToken()).access_token
        const header = { 'Authorization': `Bearer ${token}` };
        const url = `https://api.spotify.com/v1/playlists/${playlistURI}`
        this.logger.verbose(`Getting tracks from playlist ${playlistURI}`)

        return lastValueFrom(
            this.httpService
                .get<Playlist>(url, { headers: header })
                .pipe(
                    map(
                        axiosResponse => axiosResponse.data
                    ),
                    catchError(async (err) => {
                        if (err.response.status == 429) {
                            this.logger.error("429 code while fetching for album's tracks, waiting 10 seconds...")
                            await new Promise(f => setTimeout(f, 10000))
                            this.logger.warn('Trying again...')
                            return this.getPlaylistTrackItems(playlistURI)
                        }
                        this.logger.error(`An error occured while fetching spotify-api at ${url}`)
                        this.logger.error(err.response.data)
                        this.logger.debug(header, url)
                        throw new HttpException(err.message, err.response.status)
                    })
                )
        )
    }

    async getArtistsFromPlaylistTrackItems(playlistURI: string) {
        const items = this.getPlaylistTrackItems(playlistURI)
        return items.tracks.items.map(x => x.track.artists).flat()

        // for (var item of items) {
        //   for (var artist in item.track.artists) {
        //     console.log
        //   }
        // }
    }



    async getTracksDtoFromAlbum(albumURI: string): Promise<TrackDto[]> {
        const token = (await this.tokenService.getValidApiToken()).access_token
        const header = { 'Authorization': `Bearer ${token}` };
        const url = `https://api.spotify.com/v1/albums/${albumURI}/tracks`
        this.logger.verbose(`Getting tracks from album ${albumURI}`)

        return await lastValueFrom(
            this.httpService
                .get<SpotifyResponse<AlbumSimplified>>(url, { headers: header })
                .pipe(
                    map((axiosResponse) => {
                        return axiosResponse.data.items.map((track) => ({
                            uri: track.id,
                            name: track.name
                        }))
                    }),
                    catchError(async (err) => {
                        if (err.response.status == 429) {
                            this.logger.error("429 code while fetching for album's tracks, waiting 10 seconds...")
                            await new Promise(f => setTimeout(f, 10000))
                            this.logger.warn('Trying again...')
                            return this.getTracksDtoFromAlbum(albumURI)
                        }
                        this.logger.error(`An error occured while fetching spotify-api at ${url}`)
                        this.logger.error(err.response.data)
                        this.logger.debug(header, url)
                        throw new HttpException(err.message, err.response.status)
                    })
                )
        )
    }

    async getAlbumFromAlbumSimplified(albumSimplified: AlbumSimplified) {
        const token = (await this.tokenService.getValidApiToken()).access_token
        const header = { 'Authorization': `Bearer ${token}` };
        const url = `https://api.spotify.com/v1/albums/${albumSimplified.id}`
        this.logger.verbose(`Getting album from albumSimplified ${albumSimplified.id}`)

        return lastValueFrom(
            this.httpService
                .get<Album>(url, { headers: header })
                .pipe(
                    map((axiosResponse) => {
                        return axiosResponse.data
                    }),
                    catchError(async (err) => {
                        if (err.response.status == 429) {
                            this.logger.error("429 code while fetching for album's tracks, waiting 10 seconds...")
                            await new Promise(f => setTimeout(f, 10000))
                            this.logger.warn('Trying again...')
                            return this.getAlbumFromAlbumSimplified(albumSimplified)
                        }
                        this.logger.error(`An error occured while fetching spotify-api at ${url}`)
                        this.logger.error(err.response.data)
                        this.logger.debug(header, url)
                        throw new HttpException(err.message, err.response.status)
                    })
                )
        )
    }

    async getAlbumsFromArtist(artistUri: string) {
        // ATTENTION: ne regarde que les 20 derniers albums!
        const token = (await this.tokenService.getValidApiToken()).access_token
        const header = { 'Authorization': `Bearer ${token}` };
        const url = `https://api.spotify.com/v1/artists/${artistUri}/albums`
        this.logger.verbose(`Getting albums from artist ${artistUri}`)

        return lastValueFrom(
            this.httpService
                .get<{
                    items: AlbumSimplified[] //Ajouter AlbumSimplified
                }>(url, { headers: header })
                .pipe(
                    map((axiosResponse) => {
                        return axiosResponse.data.items.map(async albumSimplified => this.getAlbumFromAlbumSimplified(albumSimplified)) //Can be optimized to reduce Spotify API Calls
                    }),
                    catchError(async (err) => {
                        if (err.response.status == 429) {
                            this.logger.error("429 code while fetching for album's tracks, waiting 10 seconds...")
                            await new Promise(f => setTimeout(f, 10000))
                            this.logger.warn('Trying again...')
                            return this.getAlbumsFromArtist(artistUri)
                        }
                        this.logger.error(`An error occured while fetching spotify-api at ${url}`)
                        this.logger.error(err.response.data)
                        this.logger.debug(header, url)
                        throw new HttpException(err.message, err.response.status)
                    })
                )
        )
    }
}
