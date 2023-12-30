import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from 'src/entities/track.entity';
import { AlbumTrackItem } from 'src/interfaces/spotify/album.interface';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackEntity)
        private tracksRepository: Repository<TrackEntity>
      ) {}

    private readonly logger = new Logger(TrackService.name);

    async addTrackWithoutAlbum(track: AlbumTrackItem) {
        const foundTrack = await this.findOneTrackByTrackUri(track.uri)
        if (foundTrack != null) {
            return
        }
        const trackEntity = new TrackEntity()
        trackEntity.name = track.name
        trackEntity.trackUri = track.uri
        return this.tracksRepository.save(trackEntity)
    }

    async findOneTrackByTrackUri(trackUri: string): Promise<TrackEntity | null> {
        this.logger.verbose(`Searching in the DB for the following track '${trackUri}'`)
        return await this.tracksRepository.findOneBy({ trackUri: trackUri });
    }
}
