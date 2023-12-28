import { Controller, Get, Logger, Query } from '@nestjs/common';
import { AlbumService } from './album.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SpotifyService } from 'src/spotify/spotify.service';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
    constructor(
        private readonly albumService: AlbumService,
        private readonly spotifyService: SpotifyService,
    ) {}

    logger = new Logger(AlbumController.name)

    @Get('get_all')
    findAllAlbums() {
      this.logger.verbose('Get all albums in the DB controller called')
      return this.albumService.findAllAlbumsUri()
    }

    @ApiQuery({ name: 'artist'})
    @Get('add_by_artist')
    async appendAlbumsFromArtist(@Query('artist') artistUri) {
      this.logger.verbose('Add all albums by artist controller called')
      const albums = await this.spotifyService.getAlbumsFromArtist(artistUri)
      for (var album of albums) {
        await this.albumService.addAlbum(await album)
      }
      return await Promise.all(albums)
    }
}
