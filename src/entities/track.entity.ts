import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { PlaycountEntity } from './playcount.entity';

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

  @OneToMany(() => PlaycountEntity, (playcount) => playcount.playcount)
  playcounts: PlaycountEntity
}