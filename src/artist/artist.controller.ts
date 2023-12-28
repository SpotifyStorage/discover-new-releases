import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SpotifyService } from 'src/spotify/spotify.service';
import { ArtistService } from './artist.service';
@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  private readonly logger = new Logger(ArtistController.name);

  constructor(
    private readonly artistService: ArtistService,
    private readonly spotifyService: SpotifyService
  ) {}

  @ApiQuery({ name: 'playlist'})
  @Get('add/artist')
  async appendArtistsFromPlaylist(@Query('playlist') playlistUri) {
    this.logger.verbose('Add all albums by artist controller called');
    // Top 50 Canada: 37i9dQZEVXbMDoHDwVN2tF
    // Top Songs of 2023 Canada: 37i9dQZF1DWZWgC55ErxgS
    // Assigne a une variable toutes les artistes. Itere cette variable -> ajoue BD. Return variable initiale

    const artists = await this.spotifyService.getArtistsFromPlaylistTrackItems(playlistUri)
    let artistsUri = artists.map(artist => artist.uri)
    const uniqueArtists = artists.filter((artist, index) => artistsUri.indexOf(artist.uri) === index)

    return await this.artistService.addManyArtists(uniqueArtists)
  }

  @Get('add')
  @ApiQuery({ name: 'playlist', required: false})
  @ApiQuery({ name: 'artist', required: false})
  appendArtists(@Query('artist') artistUri, @Query('playlist') playlistUri) {
    this.logger.verbose('Add all albums by artist controller called');
    if (artistUri) {
      console.log('artist ok')
    }
    if (playlistUri) {
      console.log('playlist ok')
    }
    if (!artistUri && !playlistUri) {
      console.log('erreur')
    }
    return
  }

  @ApiQuery({ name: 'artist'})
  @Get('get_artist')
  async findArtist(@Query('artist') artistUri) {
    this.logger.verbose('Add all albums by artist controller called');
    return await this.artistService.findOneArtist(artistUri)
  }
}
