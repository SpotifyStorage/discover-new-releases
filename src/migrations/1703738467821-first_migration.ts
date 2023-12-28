import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1703738467821 implements MigrationInterface {
    name = 'FirstMigration1703738467821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artist" ("artist_uri" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_41228615a85930c488647fc8d63" PRIMARY KEY ("artist_uri"))`);
        await queryRunner.query(`CREATE TABLE "track" ("track_uri" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "popularity" int, "albumAlbumUri" nvarchar(255), CONSTRAINT "PK_a3cdb929ad9e37857ec8be430b5" PRIMARY KEY ("track_uri"))`);
        await queryRunner.query(`CREATE TABLE "album" ("album_uri" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "artistArtistUri" nvarchar(255), CONSTRAINT "PK_13f273f22fca5438f9dad3b5f5b" PRIMARY KEY ("album_uri"))`);
        await queryRunner.query(`ALTER TABLE "track" ADD CONSTRAINT "FK_6c34a679f34da5aa04a29f6fc62" FOREIGN KEY ("albumAlbumUri") REFERENCES "album"("album_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album" ADD CONSTRAINT "FK_a60e7d037d4dce10eb3a016f631" FOREIGN KEY ("artistArtistUri") REFERENCES "artist"("artist_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_a60e7d037d4dce10eb3a016f631"`);
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_6c34a679f34da5aa04a29f6fc62"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`DROP TABLE "track"`);
        await queryRunner.query(`DROP TABLE "artist"`);
    }

}
