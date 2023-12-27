import { Controller, Get, Post, Query } from '@nestjs/common';
import { TrackService } from './track.service';
import { SpotifyService } from 'src/spotify/spotify.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('track')
export class TrackController {
    constructor(
        private readonly trackService: TrackService,
        private readonly spotifyService: SpotifyService
      ) {}

    // @Get('add')
    // addTrack() {
    //   return this.trackService.addTrack();
    // }

    @Get('add/artist')
    async appendArtistsFromPlaylist(@Query('playlist') playlistUri) {
      // Top 50 Canada: 37i9dQZEVXbMDoHDwVN2tF
      // Top Songs of 2023 Canada: 37i9dQZF1DWZWgC55ErxgS
      // Assigne a une variable toutes les artites. Itere cette variable -> ajoue BD. Return variable initiale
      const artists = await this.spotifyService.getArtistsFromPlaylistTrackItems(playlistUri)
      console.log('2222222222222222222222222')
      for (var artist of artists) {
        this.trackService.addArtist(artist)
      }
      return artists
    }

    @ApiQuery({ name: 'artist'})
    @Get('add/album')
    async appendAlbumFromArtist(@Query('artist') artistUri) {
      const albums = await this.spotifyService.getAlbumsFromArtist(artistUri)
      // console.log(albums)
      for (var album of albums) {
        this.trackService.addAlbum(await album)
      }
      return albums
    }

    @Get()
    findTrack(@Query('track') trackUri) {
      return this.trackService.findTrack(trackUri)
    }
    
    @ApiQuery({ name: 'artist'})
    @Get('get_artist')
    findArtist(@Query('artist') artistUri) {
      return this.trackService.findArtist(artistUri)
    }







    @Get('test')
    test(@Query('album') albumUri) {
      return this.spotifyService.getPlaycount(albumUri)
    }
    

    // @Post('add/track')
    // async appendTracksFromArtist(@Query('artist') artistUri) {
    //   const tracks = await this.spotifyService.getTrackFromArtist(artistUri)

    //   for (var track of tracks) {
    //     this.trackService.addTrack(track)
    //   }
    //   return tracks
    // }
}
