import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackDataEntity } from 'src/entities/track-data.entity';
import { TrackController } from './track.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([TrackDataEntity])
    ],
    controllers: [TrackController],
    providers: [TrackService],
    exports: [TrackService]
})
export class TrackModule { }
