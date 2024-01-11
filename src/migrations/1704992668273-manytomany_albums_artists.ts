import { MigrationInterface, QueryRunner } from "typeorm";

export class ManytomanyAlbumsArtists1704992668273 implements MigrationInterface {
    name = 'ManytomanyAlbumsArtists1704992668273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_a60e7d037d4dce10eb3a016f631"`);
        await queryRunner.query(`CREATE TABLE "artist_albums" ("artistDataArtistUri" nvarchar(255) NOT NULL, "albumAlbumUri" nvarchar(255) NOT NULL, CONSTRAINT "PK_a8df80e93956c5bc95bc1e75f84" PRIMARY KEY ("artistDataArtistUri", "albumAlbumUri"))`);
        await queryRunner.query(`CREATE INDEX "IDX_613ad7060032bb76a780bc7d80" ON "artist_albums" ("artistDataArtistUri") `);
        await queryRunner.query(`CREATE INDEX "IDX_5f87d10aee6966b51d8e4819a6" ON "artist_albums" ("albumAlbumUri") `);
        await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "artistArtistUri"`);
        await queryRunner.query(`ALTER TABLE "artist_albums" ADD CONSTRAINT "FK_613ad7060032bb76a780bc7d80d" FOREIGN KEY ("artistDataArtistUri") REFERENCES "artist_data"("artist_uri") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "artist_albums" ADD CONSTRAINT "FK_5f87d10aee6966b51d8e4819a6f" FOREIGN KEY ("albumAlbumUri") REFERENCES "album"("album_uri") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist_albums" DROP CONSTRAINT "FK_5f87d10aee6966b51d8e4819a6f"`);
        await queryRunner.query(`ALTER TABLE "artist_albums" DROP CONSTRAINT "FK_613ad7060032bb76a780bc7d80d"`);
        await queryRunner.query(`ALTER TABLE "album" ADD "artistArtistUri" nvarchar(255)`);
        await queryRunner.query(`DROP INDEX "IDX_5f87d10aee6966b51d8e4819a6" ON "artist_albums"`);
        await queryRunner.query(`DROP INDEX "IDX_613ad7060032bb76a780bc7d80" ON "artist_albums"`);
        await queryRunner.query(`DROP TABLE "artist_albums"`);
        await queryRunner.query(`ALTER TABLE "album" ADD CONSTRAINT "FK_a60e7d037d4dce10eb3a016f631" FOREIGN KEY ("artistArtistUri") REFERENCES "artist_data"("artist_uri") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
