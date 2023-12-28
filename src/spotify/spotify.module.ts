import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [SpotifyService],
    exports: [SpotifyService]
})
export class SpotifyModule {}
