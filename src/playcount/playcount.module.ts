import { Module } from '@nestjs/common';
import { PlaycountTrackController } from './playcount-track.controller';
import { PlaycountService } from './playcount.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackStatsEntity } from 'src/entities/track-stats.entity';
import { TrackModule } from 'src/track/track.module';
import { PlaycountAlbumController } from './playcount-album.controller';
import { PlaycountArtistController } from './playcount-artist.controller';

@Module({
  imports: [
    TrackModule,
    TypeOrmModule.forFeature([TrackStatsEntity])
  ],
  controllers: [
    PlaycountTrackController,
    PlaycountAlbumController,
    PlaycountArtistController
  ],
  providers: [PlaycountService],
  exports: [PlaycountService]
})
export class PlaycountModule {}
