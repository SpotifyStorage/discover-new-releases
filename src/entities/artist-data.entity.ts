import { Entity, Column, PrimaryColumn, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { ArtistStatsEntity } from './artist-stats.entity';

@Entity({ name: 'artist_data' })
export class ArtistDataEntity {
    @PrimaryColumn({ name: "artist_uri" })
    artistUri: string;

    @Column()
    name: string;

    @ManyToMany(() => AlbumEntity, (album) => album.artists, {
        cascade: true //, eager: true
    })
    @JoinTable({
        name: "artist_album",
        joinColumn: {
            name: "artist_uri",
            referencedColumnName: "artistUri",
            foreignKeyConstraintName: "FK_artist_uri"
        },
        inverseJoinColumn: {
            name: "album_uri",
            referencedColumnName: "albumUri",
            foreignKeyConstraintName: "FK_album_uri"
        }
    })
    albums: AlbumEntity[]

    @OneToMany(() => ArtistStatsEntity, (artistStats) => artistStats.follower)
    followers: ArtistStatsEntity

    @OneToMany(() => ArtistStatsEntity, (artistStats) => artistStats.monthlyListener)
    monthlyListeners: ArtistStatsEntity

    @OneToMany(() => ArtistStatsEntity, (artistStats) => artistStats.worldRank)
    worldRanks: ArtistStatsEntity

    @OneToMany(() => ArtistStatsEntity, (artistStats) => artistStats.popularity)
    popularities: ArtistStatsEntity
}