import { Module } from '@nestjs/common';
import { ArtistStatQueueService } from './artiststat-queue.service';

@Module({
    providers: [ArtistStatQueueService],
    exports: [ArtistStatQueueService],
})
export class ArtistStatQueueModule { }
