import { Module } from '@nestjs/common';
import { ArtistQueueService } from './artist-queue.service';

@Module({
    providers: [ArtistQueueService],
    exports: [ArtistQueueService],
})
export class ArtistQueueModule { }
