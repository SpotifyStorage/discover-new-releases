import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { ArtistStatsEntity } from './artist-stats.entity';

@Entity({ name: 'artist_data' })
export class ArtistDataEntity {
  @PrimaryColumn({name: "artist_uri"})
  artistUri: string;

  @Column()
  name: string;

  @OneToMany(() => AlbumEntity, (album) => album.artist)
  albums: AlbumEntity[]

  @OneToMany(() => ArtistStatsEntity, (artistStats) => artistStats.follower)
  followers: ArtistStatsEntity

  @OneToMany(() => ArtistStatsEntity, (artistStats) => artistStats.monthlyListener)
  monthlyListeners: ArtistStatsEntity
  
  @OneToMany(() => ArtistStatsEntity, (artistStats) => artistStats.worldRank)
  worldRanks: ArtistStatsEntity

  @OneToMany(() => ArtistStatsEntity, (artistStats) => artistStats.popularity)
  popularities: ArtistStatsEntity
}