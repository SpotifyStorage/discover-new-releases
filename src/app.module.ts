import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackModule } from './track/track.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AlbumModule } from './album/album.module';
import { ArtistModule } from './artist/artist.module';
import { SpotifyModule } from './spotify/spotify.module';
import typeorm from './config/typeorm';

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
    SpotifyModule,
  ],
})
export class AppModule {}
