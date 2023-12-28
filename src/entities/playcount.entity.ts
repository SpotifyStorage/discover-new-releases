import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TrackEntity } from "./track.entity";

@Entity({ name: 'playcount' })
export class PlaycountEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TrackEntity, (track) => track.trackUri)
    //@Column()
    uri: TrackEntity;
    
    @Column()
    playcount: number;

    @Column()
    date: string;
}