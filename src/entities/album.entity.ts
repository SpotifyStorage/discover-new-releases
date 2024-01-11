import { Entity, Column, PrimaryColumn, OneToMany, ManyToMany, JoinColumn, ManyToOne } from 'typeorm';
import { ArtistDataEntity } from './artist-data.entity';
import { TrackDataEntity } from './track-data.entity';

@Entity({ name: 'album' })
export class AlbumEntity {
  @PrimaryColumn({name: "album_uri"})
  albumUri: string;

  @Column()
  name: string;

  @Column()
  type: string;       // 'SINGLE' | 'ALBUM' | 'COMPILATION'

  @OneToMany(() => TrackDataEntity, (track) => track.album, {
    cascade: true
  })
  tracks: TrackDataEntity[]

  @ManyToMany(() => ArtistDataEntity, (artist) => artist.albums, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({name: "artist_uri"})
  artists: ArtistDataEntity[]
}