import { Module } from '@nestjs/common';
import { AbcService } from './abc.service';
import { AbcController } from './abc.controller';
import { ArtistModule } from 'src/artist/artist.module';
import { ArtistQueueModule } from 'src/artist-queue/artist-queue.module';
import { SpotifyPartnerModule } from 'src/spotify-partner/spotify-partner.module';

@Module({
  imports: [
    ArtistModule,
    ArtistQueueModule,
    SpotifyPartnerModule,
  ],
  providers: [AbcService],
  controllers: [AbcController]
})
export class AbcModule {}
