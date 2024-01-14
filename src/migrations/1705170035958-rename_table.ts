import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTable1705170035958 implements MigrationInterface {
    name = 'RenameTable1705170035958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artist_album" ("artist_uri" nvarchar(255) NOT NULL, "album_uri" nvarchar(255) NOT NULL, CONSTRAINT "PK_fca6d53c1b7ae70d84d6477056a" PRIMARY KEY ("artist_uri", "album_uri"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0d931eb3968ff224ce440a09ca" ON "artist_album" ("artist_uri") `);
        await queryRunner.query(`CREATE INDEX "IDX_2519b47476b474918db1f9b491" ON "artist_album" ("album_uri") `);
        await queryRunner.query(`ALTER TABLE "artist_album" ADD CONSTRAINT "FK_0d931eb3968ff224ce440a09cab" FOREIGN KEY ("artist_uri") REFERENCES "artist_data"("artist_uri") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "artist_album" ADD CONSTRAINT "FK_2519b47476b474918db1f9b491a" FOREIGN KEY ("album_uri") REFERENCES "album"("album_uri") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist_album" DROP CONSTRAINT "FK_2519b47476b474918db1f9b491a"`);
        await queryRunner.query(`ALTER TABLE "artist_album" DROP CONSTRAINT "FK_0d931eb3968ff224ce440a09cab"`);
        await queryRunner.query(`DROP INDEX "IDX_2519b47476b474918db1f9b491" ON "artist_album"`);
        await queryRunner.query(`DROP INDEX "IDX_0d931eb3968ff224ce440a09ca" ON "artist_album"`);
        await queryRunner.query(`DROP TABLE "artist_album"`);
    }

}
