import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { AlbumEntity } from './album.entity';

@Entity({ name: 'track' })
export class TrackEntity {
  @PrimaryColumn({name: "track_uri"})
  trackUri: string;

  @Column()
  name: string;

  @Column({
    nullable: true
  })
  popularity?: number;

  @ManyToOne(() => AlbumEntity, (album) => album.tracks)
  album: AlbumEntity
}