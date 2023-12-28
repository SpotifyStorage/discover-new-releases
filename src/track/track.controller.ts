import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { TrackService } from './track.service';
import { SpotifyService } from 'src/spotify/spotify.service';
import { ApiQuery } from '@nestjs/swagger';
import { PlaycountDto } from './dto/playcount.dto';

@Controller('track')
export class TrackController {
    constructor(
        private readonly trackService: TrackService,
        private readonly spotifyService: SpotifyService
      ) {}
    private readonly logger = new Logger(TrackController.name);
    @ApiQuery({ name: 'playlist'})
    @Get('add/artist')
    async appendArtistsFromPlaylist(@Query('playlist') playlistUri) {
      // Top 50 Canada: 37i9dQZEVXbMDoHDwVN2tF
      // Top Songs of 2023 Canada: 37i9dQZF1DWZWgC55ErxgS
      // Assigne a une variable toutes les artistes. Itere cette variable -> ajoue BD. Return variable initiale

      const artists = await this.spotifyService.getArtistsFromPlaylistTrackItems(playlistUri)
      let artistsUri = artists.map(artist => artist.uri)
      const uniqueArtists = artists.filter((artist, index) => artistsUri.indexOf(artist.uri) === index)

      return await this.trackService.addManyArtists(uniqueArtists)
    }

    @ApiQuery({ name: 'artist'})
    @Get('add/album')
    async appendAlbumFromArtist(@Query('artist') artistUri) {
      const albums = await this.spotifyService.getAlbumsFromArtist(artistUri)
      for (var album of albums) {
        await this.trackService.addAlbum(await album)
      }
      return await Promise.all(albums)
    }

    @Get()
    findTrack(@Query('track') trackUri) {
      return this.trackService.findTrack(trackUri)
    }
    
    @ApiQuery({ name: 'artist'})
    @Get('get_artist')
    async findArtist(@Query('artist') artistUri) {
      return await this.trackService.findOneArtist(artistUri)
    }

    @ApiQuery({ name: 'track'})
    @Get('get_track')
    async findOneTrack(@Query('track') trackUri) {
      return await this.trackService.findOneTrackByTrackUri(trackUri)
    }

    @Post('playcount')
    appendPlaycountToDatabase(@Body() playcountData: PlaycountDto[]) {
      this.logger.verbose("Adding playcount to database")
      return this.trackService.addManyPlaycount(playcountData)

      //return this.trackService.addPlaycount(playcountData)
    }

    @Get('find_all_albums')
    findAllAlbums() {
      this.logger.verbose("Finding all albums")
      return this.trackService.findAllAlbumsUri()
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
