import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map, tap } from 'rxjs';
import { ApiResponseT4ils } from '../interfaces/api-response-t4ils.interface';
import { Token } from '../interfaces/spotify/token.interface';
import { Playlist } from 'src/interfaces/spotify/playlist.interface';
import { Album } from 'src/interfaces/spotify/album.interface';
import { AlbumSimplified } from 'src/interfaces/spotify/album-simplified.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SpotifyService {
  
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {this.getValidToken()}

  activeToken = {
    access_token: '',
    token_type: 'Bearer',
    expires_in: new Date()
  };

  async getNewToken(): Promise<Token> {
    const client_id = this.configService.get<string>('SPOTIFY_CLIENT_ID');
    const client_secret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET')

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
        },
    }).then(x => x.json());

    const now = new Date();
    const expirationTime = new Date(now.getTime() + response.expires_in * 1000);
    response.expires_in = expirationTime;
    
    return response
  }

  isTokenActive(): boolean {
    const now = new Date();

    if (now.valueOf() > this.activeToken.expires_in.valueOf()) {
      return false
    }

    return true
  }

  async getValidToken() {
    if (!this.isTokenActive()) {
      return this.getNewToken()        // christophe est pas trop confiant ici mais avait finalement raison
    }
    return this.activeToken
  }


  async callAlbumFromArtist(artistURI: string = '5eAWCfyUhZtHHtBdNk56l1') {
    const token = (await this.getValidToken()).access_token
    console.log(token)
    const header = {'Authorization': `Bearer ${token}`};
    //const header = {"Authorization" : `Bearer ${tokenStr}`}}

    return lastValueFrom(
      this.httpService
        .get<ApiResponseT4ils>(`https://api.spotify.com/v1/artists/${artistURI}/albums`, {headers: header})
        .pipe(
          map(
            axiosResponse => axiosResponse.data
          )
        )
    )
  }

  async getPlaylistTrackItems(playlistURI: string) {
    const token = (await this.getValidToken()).access_token
    const header = {'Authorization': `Bearer ${token}`};

    return lastValueFrom(
      this.httpService
      .get<Playlist>(`https://api.spotify.com/v1/playlists/${playlistURI}`, {headers: header})
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



  async getTracksFromArtist(artistURI: string) {
    return
  }

  async getAlbumFromAlbumSimplified(albumSimplified: AlbumSimplified) {
    const token = (await this.getValidToken()).access_token
    const header = {'Authorization': `Bearer ${token}`};

    return lastValueFrom(
      this.httpService
      .get<Album>(`https://api.spotify.com/v1/albums/${albumSimplified.id}`, {headers: header})
      .pipe(
          map((axiosResponse) => {
            return axiosResponse.data
          })
      )
    )
  }

  async getAlbumsFromArtist(artistUri: string) {
    // ATTENTION: ne regarde que les 20 derniers albums!
    const token = (await this.getValidToken()).access_token
    const header = {'Authorization': `Bearer ${token}`};

    return lastValueFrom(
      this.httpService
      .get<{
        items: AlbumSimplified[] //Ajouter AlbumSimplified
      }>(`https://api.spotify.com/v1/artists/${artistUri}/albums`, {headers: header})
      .pipe(
          map((axiosResponse) => {
            return axiosResponse.data.items.map(async albumSimplified => this.getAlbumFromAlbumSimplified(albumSimplified)) //Can be optimized to reduce Spotify API Calls
          })
      )
    )
  }
  
}
