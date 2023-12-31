import { Module } from '@nestjs/common';
import { SpotifyPartnerService } from './spotify-partner.service';
import { HttpModule } from '@nestjs/axios';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    HttpModule,
    TokenModule
  ],
  providers: [SpotifyPartnerService],
  exports: [SpotifyPartnerService]
})
export class SpotifyPartnerModule {}
