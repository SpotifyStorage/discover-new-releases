import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { TrackEntity } from './track.entity';
import { AlbumEntity } from './album.entity';

@Entity({ name: 'artist' })
export class ArtistEntity {
  @PrimaryColumn({name: "artist_uri"})
  artistUri: string;

  @Column()
  name: string;

  @OneToMany(() => AlbumEntity, (album) => album.artist)
  albums: AlbumEntity[]
}