import { Controller, Get, Inject, Logger, Post, Query, forwardRef } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SpotifyApiService } from 'src/spotify-api/spotify-api.service';
import { ArtistService } from './artist.service';
import { ResponseDto } from 'src/interfaces/dto/response.dto';
import { ArtistDataEntity } from 'src/entities/artist-data.entity';
@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  private readonly logger = new Logger(ArtistController.name);

  constructor(
    
    private readonly artistService: ArtistService,

    private readonly spotifyService: SpotifyApiService
  ) {}

  @Get('all')
  @ApiOperation({summary: "Get a list of all the artists' uri in the database"})
  async findAllAlbums() {
    this.logger.verbose("Get all albums' uri in the DB controller called")
    return this.artistService.findAllArtistsUri()
  }

  @Get(':id')
  @ApiQuery({ name: 'artistId'})
  @ApiOperation({summary: "Get data from the database of an artist with their albums and trakcs"})
  async findArtist(@Query('artistId') artistUri) {
    this.logger.verbose('Get all albums by artist controller called');
    return await this.artistService.findOneArtist(artistUri)
  }

  @Post('playlist')
  @ApiQuery({ name: 'playlistId'})
  @ApiOperation({summary: "Add all the artists from a playlist to the database"})
  async appendArtistsFromPlaylist(@Query('playlistId') playlistUri) {
    this.logger.verbose('Add all albums by artist controller called');
    // Top 50 Canada: 37i9dQZEVXbMDoHDwVN2tF
    // Top Songs of 2023 Canada: 37i9dQZF1DWZWgC55ErxgS
    // Assigne a une variable toutes les artistes. Itere cette variable -> ajoue BD. Return variable initiale

    const artists = await this.spotifyService.getArtistsFromPlaylistTrackItems(playlistUri)
    let artistsUri = artists.map(artist => artist.uri)
    const uniqueArtists = artists.filter((artist, index) => artistsUri.indexOf(artist.uri) === index)

    return await this.artistService.addManyArtists(uniqueArtists)
  }

  @Post(':id')
  @ApiQuery({name: 'artistId'})
  @ApiOperation({summary: "Add one artist with all it's albums and their tracks to the database"})
  async addOneArtist(@Query('artistId') artistUri): Promise<ResponseDto<ArtistDataEntity>> {
    return {
      status: 'success',
      data: await this.artistService.addOneArtist(artistUri)
    }
  }
}


  // @Get('add')
  // @ApiQuery({ name: 'playlist', required: false})
  // @ApiQuery({ name: 'artist', required: false})
  // appendArtists(@Query('artist') artistUri, @Query('playlist') playlistUri) {
  //   this.logger.verbose('Add all albums by artist controller called');
  //   if (artistUri) {
  //     console.log(artistUri)
  //   }
  //   if (playlistUri) {
  //     console.log(playlistUri)
  //   }
  //   if (!artistUri && !playlistUri) {
  //     console.log('erreur')
  //   }
  //   return
  // }
