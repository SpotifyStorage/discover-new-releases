import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/entities/album.entity';
import { TrackDataEntity } from 'src/entities/track-data.entity';
import { ArtistModule } from 'src/artist/artist.module';
import { HttpModule } from '@nestjs/axios';
import { SpotifyApiModule } from 'src/spotify-api/spotify-api.module';
import { TrackModule } from 'src/track/track.module';

@Module({
    imports: [
        HttpModule,
        //ArtistModule,
        TrackModule,
        SpotifyApiModule,
        TypeOrmModule.forFeature([TrackDataEntity, AlbumEntity])
    ],
    providers: [AlbumService],
    controllers: [AlbumController],
    exports: [AlbumService]
})
export class AlbumModule { }
