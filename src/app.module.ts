import { Logger, Module, OnModuleInit } from '@nestjs/common';
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
import { ArtistQueueModule } from './artist-queue/artist-queue.module';
import { ArtistQueueService } from './artist-queue/artist-queue.service';
import { AbcModule } from './abc/abc.module';
import { AbcService } from './abc/abc.service';

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
        ArtistQueueModule,
        AbcModule,
    ],
    providers: [],
    controllers: [],
})
export class AppModule implements OnModuleInit {
    constructor(
        private readonly artistQueueService: ArtistQueueService,
        private readonly abcService: AbcService,
    ) { }

    logger = new Logger(AppModule.name)

    onModuleInit() {
        const receiver = this.artistQueueService.addReceiver(async message => {
            //this.logger.verbose(`Received a messages from the queue containing ${message.body.length} albums`)
            message.body.forEach(async artist => {
                this.abcService.getArtistDailyStats(artist)
            })
        })
    }
}
