import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackDataEntity } from 'src/entities/track-data.entity';
import { AlbumTrackItem } from 'src/interfaces/spotify-api/album.interface';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackDataEntity)
        private tracksRepository: Repository<TrackDataEntity>
    ) { }

    private readonly logger = new Logger(TrackService.name);

    async addTrackWithoutAlbum(track: AlbumTrackItem) {
        const foundTrack = await this.findOneTrackByTrackUri(track.uri)
        if (foundTrack != null) {
            return
        }
        const trackEntity = new TrackDataEntity()
        trackEntity.name = track.name
        trackEntity.trackUri = track.uri
        return this.tracksRepository.save(trackEntity)
    }

    async findOneTrackByTrackUri(trackUri: string): Promise<TrackDataEntity | null> {
        this.logger.verbose(`Searching in the DB for the following track '${trackUri}'`)
        return await this.tracksRepository.findOneBy({ trackUri: trackUri });
    }
}
