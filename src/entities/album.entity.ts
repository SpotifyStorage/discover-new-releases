import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';
import { ArtistEntity } from './artist.entity';
import { TrackEntity } from './track.entity';

@Entity({ name: 'album' })
export class AlbumEntity {
  @PrimaryColumn({name: "album_uri"})
  albumUri: string;

  @Column()
  name: string;

  @OneToMany(() => TrackEntity, (track) => track.album, {
    cascade: true
  })
  tracks: TrackEntity[]

  @ManyToOne(() => ArtistEntity, (artist) => artist.albums)
  artist: ArtistEntity
}