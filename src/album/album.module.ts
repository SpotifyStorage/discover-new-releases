import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/entities/album.entity';
import { TrackEntity } from 'src/entities/track.entity';
import { ArtistModule } from 'src/artist/artist.module';
import { HttpModule } from '@nestjs/axios';
import { SpotifyModule } from 'src/spotify/spotify.module';

@Module({
  imports: [
    HttpModule,
    ArtistModule,
    SpotifyModule,
    TypeOrmModule.forFeature([TrackEntity, AlbumEntity])
  ],
  providers: [AlbumService],
  controllers: [AlbumController],
  exports: [AlbumService]
})
export class AlbumModule {}
