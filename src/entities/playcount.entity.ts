import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TrackEntity } from "./track.entity";

@Entity({ name: 'playcount' })
export class PlaycountEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TrackEntity, (track) => track.trackUri, {
        cascade: true
    })
    track: TrackEntity;
    
    @Column({ type: 'bigint' })
    playcount: number;

    @Column({ type: 'bigint' })
    date: number;
}