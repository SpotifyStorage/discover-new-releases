import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { TrackStatsEntity } from './track-stats.entity';

@Entity({ name: 'track_data' })
export class TrackDataEntity {

    @PrimaryColumn({ name: "track_uri" })
    trackUri: string;

    @Column()
    name: string;

    @Column({
        nullable: true
    })
    popularity?: number;

    @ManyToOne(() => AlbumEntity, (album) => album.tracks, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: "album_uri" })
    album: AlbumEntity

    @OneToMany(() => TrackStatsEntity, (playcount) => playcount.playcount)
    playcounts: TrackStatsEntity

}