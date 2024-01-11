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
        private readonly tokenService: TokenService

    ) { }

    async callAlbumFromArtist(artistURI: string = '5eAWCfyUhZtHHtBdNk56l1') {
        const token = (await this.tokenService.getValidApiToken()).access_token
        const header = { 'Authorization': `Bearer ${token}` };
        this.logger.verbose(`Getting albums from artist ${artistURI}`)
        //const header = {"Authorization" : `Bearer ${tokenStr}`}}

        return lastValueFrom(
            this.httpService
                .get<ApiResponseT4ils>(`https://api.spotify.com/v1/artists/${artistURI}/albums`, { headers: header })
                .pipe(
                    map(
                        axiosResponse => axiosResponse.data
                    )
                )
        )
    }

    async getPlaylistTrackItems(playlistURI: string) {
        const token = (await this.tokenService.getValidApiToken()).access_token
        const header = { 'Authorization': `Bearer ${token}` };
        this.logger.verbose(`Getting tracks from playlist ${playlistURI}`)

        return lastValueFrom(
            this.httpService
                .get<Playlist>(`https://api.spotify.com/v1/playlists/${playlistURI}`, { headers: header })
                .pipe(
                    map(
                        axiosResponse => axiosResponse.data
                    )
                )
        )
    }

    async getArtistsFromPlaylistTrackItems(playlistURI: string) {
        const items = (await this.getPlaylistTrackItems(playlistURI)).tracks.items
        return items.map(x => x.track.artists).flat()

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
                    map( (axiosResponse) => {
                        return axiosResponse.data.items.map((track) => ({
                            uri: track.id,
                            name: track.name
                        }))
                    }),
                    catchError( (err) => {
                        this.logger.error(`An error occured while fetching spotify-api at ${url}`)
                        this.logger.error(err.response.data)
                        console.log(header, url)
                        throw new HttpException(err.message, err.response.status)
                    })
                )
        )
    }


    async getAlbumFromAlbumSimplified(albumSimplified: AlbumSimplified) {
        const token = (await this.tokenService.getValidApiToken()).access_token
        const header = { 'Authorization': `Bearer ${token}` };
        this.logger.verbose(`Getting album from albumSimplified ${albumSimplified.id}`)

        return lastValueFrom(
            this.httpService
                .get<Album>(`https://api.spotify.com/v1/albums/${albumSimplified.id}`, { headers: header })
                .pipe(
                    map((axiosResponse) => {
                        return axiosResponse.data
                    })
                )
        )
    }

    async getAlbumsFromArtist(artistUri: string) {
        // ATTENTION: ne regarde que les 20 derniers albums!
        const token = (await this.tokenService.getValidApiToken()).access_token
        const header = { 'Authorization': `Bearer ${token}` };
        this.logger.verbose(`Getting albums from artist ${artistUri}`)

        return lastValueFrom(
            this.httpService
                .get<{
                    items: AlbumSimplified[] //Ajouter AlbumSimplified
                }>(`https://api.spotify.com/v1/artists/${artistUri}/albums`, { headers: header })
                .pipe(
                    map((axiosResponse) => {
                        return axiosResponse.data.items.map(async albumSimplified => this.getAlbumFromAlbumSimplified(albumSimplified)) //Can be optimized to reduce Spotify API Calls
                    })
                )
        )
    }
}
