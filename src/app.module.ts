import { Module, OnModuleInit } from '@nestjs/common';
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
import { DiscoverModule } from './discover/discover.module';
import { DiscoverService } from './discover/discover.service';

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
        //ArtistQueueModule,
        DiscoverModule,
    ],
    providers: [],
    controllers: [],
})
export class AppModule implements OnModuleInit {

    constructor(
        private readonly discoverService: DiscoverService,
    ) { }

    onModuleInit() {
        this.discoverService.initArtistQueueReceiver()
    }
}
