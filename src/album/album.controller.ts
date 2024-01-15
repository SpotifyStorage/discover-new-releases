import { Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { AlbumService } from './album.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SpotifyApiService } from 'src/spotify-api/spotify-api.service';
import { AlbumEntity } from 'src/entities/album.entity';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
    constructor(
        private readonly albumService: AlbumService,
        private readonly spotifyService: SpotifyApiService,
    ) { }

    logger = new Logger(AlbumController.name)

    @Get('all')
    @ApiOperation({ summary: "Get a list of all the albums in the database" })
    findAllAlbums(): Promise<AlbumEntity[]> {
        this.logger.verbose('Get all albums in the DB controller called')
        return this.albumService.findAllAlbumsUri()
    }



    // @ApiQuery({ name: 'artist'})
    // @Get('add_by_artist')
    // async appendAlbumsFromArtist(@Query('artist') artistUri) {
    //   this.logger.verbose('Add all albums by artist controller called')
    //   const albums = await this.spotifyService.getAlbumsFromArtist(artistUri)
    //   for (var album of albums) {
    //     await this.albumService.addAlbum(await album)
    //   }
    //   return await Promise.all(albums)
    // }
}
