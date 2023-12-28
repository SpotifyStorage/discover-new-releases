import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from 'src/entities/artist.entity';
import { Artist } from 'src/interfaces/spotify/artist.interface';
import { artistToEntity } from 'src/utilities/artist.utilities';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class ArtistService {
    constructor(
        @InjectRepository(ArtistEntity)
        private artistRepository: Repository<ArtistEntity>, 
        private dataSource: DataSource,
    ) {}
    logger = new Logger(ArtistService.name);

    async findOneArtistByArtistUri(artistUri: string): Promise<ArtistEntity | null> {
        return this.artistRepository.findOneBy({ artistUri: artistUri });
    }

    async addManyArtists(artists: Artist[]) {
        this.logger.verbose(`Adding ${artists.length} artists`)
        let uniqueArtist = artists
        const existingArtists = await this.artistRepository.find({
            where: {
                artistUri: In(artists.map(artist => artist.id))
            }
        })
        if (existingArtists.length > 0) {
            uniqueArtist = artists.filter(artist => 
                (existingArtists.find(existingArtist => existingArtist.artistUri == artist.id)) == null
            )
        }
        await this.dataSource.createQueryBuilder()
            .insert()
            .into(ArtistEntity)
            .values(uniqueArtist.map(artist => {
                return artistToEntity(artist)
            }))
            .execute()
        return this.artistRepository.find({
            where: {
                artistUri: In(artists.map(artist => artist.id))
            }
        })
    }
    async addArtist(artist: Artist) {
        // probleme: pas tous les artistes sont ajoutés
        artist.uri = artist.id
        const foundArtist = await this.findOneArtistByArtistUri(artist.uri)
        if (foundArtist != null) {
            return
        }
        const artistEntity = new ArtistEntity()
        artistEntity.artistUri = artist.uri
        artistEntity.name = artist.name
        this.artistRepository.save(artistEntity)
    }

    async findOneArtist(artistUri: string) {
        return this.artistRepository.findOne({
            where: {
                artistUri: artistUri
            },
            relations: {
                albums: {
                    tracks: true
                }
            }
        })
    }
}
