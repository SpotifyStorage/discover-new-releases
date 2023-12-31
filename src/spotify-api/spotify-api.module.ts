import { Module } from '@nestjs/common';
import { SpotifyApiService } from './spotify-api.service';
import { HttpModule } from '@nestjs/axios';
import { TokenModule } from 'src/token/token.module';

@Module({
    imports: [
        HttpModule,
        TokenModule
    ],
    providers: [SpotifyApiService],
    exports: [SpotifyApiService]
})
export class SpotifyApiModule {}
