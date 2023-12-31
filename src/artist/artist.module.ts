import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistDataEntity } from 'src/entities/artist-data.entity';
import { SpotifyApiModule } from 'src/spotify-api/spotify-api.module';
import { SpotifyPartnerModule } from 'src/spotify-partner/spotify-partner.module';
import { AlbumModule } from 'src/album/album.module';
import { TrackModule } from 'src/track/track.module';
import { AlbumEntity } from 'src/entities/album.entity';

@Module({
  imports: [
    SpotifyApiModule,
    SpotifyPartnerModule,
    AlbumModule,
    TrackModule,
    TypeOrmModule.forFeature([ArtistDataEntity, AlbumEntity])
  ],
  providers: [ArtistService],
  controllers: [ArtistController],
  exports: [ArtistService]
})
export class ArtistModule {}
