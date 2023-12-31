import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';
import { ArtistDataEntity } from './artist-data.entity';
import { TrackDataEntity } from './track-data.entity';

@Entity({ name: 'album' })
export class AlbumEntity {
  @PrimaryColumn({name: "album_uri"})
  albumUri: string;

  @Column()
  name: string;

  @OneToMany(() => TrackDataEntity, (track) => track.album, {
    cascade: true
  })
  tracks: TrackDataEntity[]

  @ManyToOne(() => ArtistDataEntity, (artist) => artist.albums)
  artist: ArtistDataEntity
}