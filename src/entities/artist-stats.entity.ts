import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ArtistDataEntity } from "./artist-data.entity";

@Entity({ name: 'artist_stats' })
export class ArtistStatsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ArtistDataEntity, (artist) => artist.artistUri, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: "artist_uri" })
    artist: ArtistDataEntity;

    @Column()
    popularity: number;

    @Column()
    follower: number;

    @Column({ name: "monthly_listener" })
    monthlyListener: number;

    @Column({ name: "world_rank" })
    worldRank: number;

    @Column({ type: 'bigint' })
    date: number;
}