import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from 'src/entities/track.entity';
import { TrackController } from './track.controller';
import { ArtistEntity } from 'src/entities/artist.entity';
import { SpotifyService } from 'src/spotify/spotify.service';
import { HttpModule } from '@nestjs/axios';
import { AlbumEntity } from 'src/entities/album.entity';
import { PlaycountEntity } from 'src/entities/playcount.entity';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([TrackEntity, ArtistEntity, AlbumEntity, PlaycountEntity])
    ],
    controllers: [TrackController],
    providers: [TrackService, SpotifyService]
})
export class TrackModule {}
