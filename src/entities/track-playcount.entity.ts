import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TrackEntity } from "./track.entity";

@Entity({ name: 'track_playcount' })
export class TrackPlayCountEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TrackEntity, (track) => track.trackUri)
    uri: TrackEntity;
    
    @Column()
    playcount: number;

    @Column()
    date: string;
}