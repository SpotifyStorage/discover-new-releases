import { Module } from '@nestjs/common';
import { DiscoverService } from './discover.service';
import { DiscoverController } from './discover.controller';
import { ArtistModule } from 'src/artist/artist.module';
import { SpotifyPartnerModule } from 'src/spotify-partner/spotify-partner.module';
import { ArtistQueueModule } from 'src/queues/artist-queue.module';
import { ArtistStatQueueModule } from 'src/queues/artiststat-queue.module';
import { AlbumModule } from 'src/album/album.module';
import { SpotifyApiModule } from 'src/spotify-api/spotify-api.module';

@Module({
  imports: [
    ArtistModule,
    AlbumModule,
    ArtistQueueModule,
    ArtistStatQueueModule,
    SpotifyPartnerModule,
    SpotifyApiModule,
  ],
  providers: [DiscoverService],
  controllers: [DiscoverController],
  exports: [DiscoverService]
})
export class DiscoverModule {}
