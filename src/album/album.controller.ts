import { Controller, Get, Query } from '@nestjs/common';
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

    @Get('find_all_albums')
    findAllAlbums() {
      return this.albumService.findAllAlbumsUri()
    }

    @ApiQuery({ name: 'artist'})
    @Get('add/album')
    async appendAlbumFromArtist(@Query('artist') artistUri) {
      const albums = await this.spotifyService.getAlbumsFromArtist(artistUri)
      for (var album of albums) {
        await this.albumService.addAlbum(await album)
      }
      return await Promise.all(albums)
    }
}
