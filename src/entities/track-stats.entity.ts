import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TrackDataEntity } from "./track-data.entity";

@Entity({ name: 'track_stats' })
export class TrackStatsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TrackDataEntity, (track) => track.trackUri, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: "track_uri"})
    track: TrackDataEntity;
    
    @Column({ type: 'bigint' })
    playcount: number;

    @Column({ type: 'bigint' })
    date: number;
}