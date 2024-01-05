import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackModule } from './track/track.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AlbumModule } from './album/album.module';
import { ArtistModule } from './artist/artist.module';
import { SpotifyApiModule } from './spotify-api/spotify-api.module';
import { PlaycountModule } from './playcount/playcount.module';
import { TokenModule } from './token/token.module';
import { SpotifyPartnerModule } from './spotify-partner/spotify-partner.module';
import typeorm from './config/typeorm';
import { RouterModule } from '@nestjs/core';
// import { DiscoveryService } from './discovery/discovery.service';
// import { DiscoveryController } from './discovery/discovery.controller';
// import { DiscoveryModule } from './discovery/discovery.module';
import { ServiceBusClient } from '@azure/service-bus';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env-spotify'],
      load: [typeorm],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => (configService.get('typeorm')),
      inject: [ConfigService],
    }),
    TrackModule,
    AlbumModule,
    ArtistModule,
    SpotifyApiModule,
    PlaycountModule,
    TokenModule,
    SpotifyPartnerModule,
    //DiscoveryModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
