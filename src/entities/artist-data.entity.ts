import { Entity, Column, PrimaryColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { ArtistStatsEntity } from './artist-stats.entity';

@Entity({ name: 'artist_data' })
export class ArtistDataEntity {
    @PrimaryColumn({ name: "artist_uri" })
    artistUri: string;

    @Column()
    name: string;

    @ManyToMany(() => AlbumEntity, (album) => album.artists)
    @JoinTable({
        name: "artist_albums",
    })
    //@OneToMany(() => AlbumEntity, (album) => album.artists)
    // {
    //     name: "artist_albums",
    //     joinColumn: {
    //         name: "artist",
    //         referencedColumnName: "artist_uri"
    //     },
    //     inverseJoinColumn: {
    //         name: "album",
    //         referencedColumnName: "album_uri"
    //     }
    // }
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