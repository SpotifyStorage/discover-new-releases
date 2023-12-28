import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from 'src/entities/artist.entity';
import { SpotifyModule } from 'src/spotify/spotify.module';

@Module({
  imports: [
    SpotifyModule,
    TypeOrmModule.forFeature([ArtistEntity])
  ],
  providers: [ArtistService],
  controllers: [ArtistController],
  exports: [ArtistService]
})
export class ArtistModule {}
