import { Module } from '@nestjs/common';
import { PlaycountController } from './playcount.controller';
import { PlaycountService } from './playcount.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackStatsEntity } from 'src/entities/track-stats.entity';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [
    TrackModule,
    TypeOrmModule.forFeature([TrackStatsEntity])
  ],
  controllers: [PlaycountController],
  providers: [PlaycountService],
  exports: [PlaycountService]
})
export class PlaycountModule {}
