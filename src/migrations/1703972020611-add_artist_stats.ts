import { MigrationInterface, QueryRunner } from "typeorm";

export class AddArtistStats1703972020611 implements MigrationInterface {
    name = 'AddArtistStats1703972020611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_a60e7d037d4dce10eb3a016f631"`);
        await queryRunner.query(`CREATE TABLE "track_stats" ("id" int NOT NULL IDENTITY(1,1), "playcount" bigint NOT NULL, "date" bigint NOT NULL, "track_uri" nvarchar(255), CONSTRAINT "PK_aa2beb8fd6bca31677d877e9903" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "track_data" ("track_uri" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "popularity" int, "album_uri" nvarchar(255), CONSTRAINT "PK_cc564b3f625800bfd65092f9eb5" PRIMARY KEY ("track_uri"))`);
        await queryRunner.query(`CREATE TABLE "artist_data" ("artist_uri" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_561afaec77160fec1b56f5d87c6" PRIMARY KEY ("artist_uri"))`);
        await queryRunner.query(`CREATE TABLE "artist_stats" ("id" int NOT NULL IDENTITY(1,1), "popularity" int NOT NULL, "follower" int NOT NULL, "monthly_listener" int NOT NULL, "world_rank" int NOT NULL, "date" bigint NOT NULL, "artist_uri" nvarchar(255), CONSTRAINT "PK_40fbe18db81482479da4a74a3f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "track_stats" ADD CONSTRAINT "FK_9777cff976bad6ca6de2ec963b7" FOREIGN KEY ("track_uri") REFERENCES "track_data"("track_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_data" ADD CONSTRAINT "FK_ca1eca98694669d4d646cda1b39" FOREIGN KEY ("album_uri") REFERENCES "album"("album_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album" ADD CONSTRAINT "FK_a60e7d037d4dce10eb3a016f631" FOREIGN KEY ("artistArtistUri") REFERENCES "artist_data"("artist_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "artist_stats" ADD CONSTRAINT "FK_a318ca696b744f767f3b008a754" FOREIGN KEY ("artist_uri") REFERENCES "artist_data"("artist_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        //await queryRunner.query(`DROP TABLE "artist"`);
        //await queryRunner.query(`DROP TABLE "track"`);
        //await queryRunner.query(`DROP TABLE "playcount"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist_stats" DROP CONSTRAINT "FK_a318ca696b744f767f3b008a754"`);
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_a60e7d037d4dce10eb3a016f631"`);
        await queryRunner.query(`ALTER TABLE "track_data" DROP CONSTRAINT "FK_ca1eca98694669d4d646cda1b39"`);
        await queryRunner.query(`ALTER TABLE "track_stats" DROP CONSTRAINT "FK_9777cff976bad6ca6de2ec963b7"`);
        await queryRunner.query(`DROP TABLE "artist_stats"`);
        await queryRunner.query(`DROP TABLE "artist_data"`);
        await queryRunner.query(`DROP TABLE "track_data"`);
        await queryRunner.query(`DROP TABLE "track_stats"`);
        await queryRunner.query(`ALTER TABLE "album" ADD CONSTRAINT "FK_a60e7d037d4dce10eb3a016f631" FOREIGN KEY ("artistArtistUri") REFERENCES "artist"("artist_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
