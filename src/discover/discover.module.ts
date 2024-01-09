import { Module } from '@nestjs/common';
import { DiscoverService } from './discover.service';
import { DiscoverController } from './discover.controller';
import { ArtistModule } from 'src/artist/artist.module';
import { SpotifyPartnerModule } from 'src/spotify-partner/spotify-partner.module';
import { ArtistQueueModule } from 'src/queues/artist-queue.module';
import { ArtistStatQueueModule } from 'src/queues/artiststat-queue.module';

@Module({
  imports: [
    ArtistModule,
    ArtistQueueModule,
    ArtistStatQueueModule,
    SpotifyPartnerModule,
  ],
  providers: [DiscoverService],
  controllers: [DiscoverController],
  exports: [DiscoverService]
})
export class DiscoverModule {}
