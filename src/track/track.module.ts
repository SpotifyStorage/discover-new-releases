import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from 'src/entities/track.entity';
import { TrackController } from './track.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([TrackEntity])
    ],
    controllers: [TrackController],
    providers: [TrackService],
    exports: [TrackService]
})
export class TrackModule {}
