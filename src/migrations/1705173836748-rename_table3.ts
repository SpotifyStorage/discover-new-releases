import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTable31705173836748 implements MigrationInterface {
    name = 'RenameTable31705173836748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist_album" DROP CONSTRAINT "FK_2519b47476b474918db1f9b491a"`);
        await queryRunner.query(`ALTER TABLE "artist_album" DROP CONSTRAINT "FK_0d931eb3968ff224ce440a09cab"`);
        await queryRunner.query(`ALTER TABLE "artist_album" ADD CONSTRAINT "FK_artist_uri" FOREIGN KEY ("artist_uri") REFERENCES "artist_data"("artist_uri") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "artist_album" ADD CONSTRAINT "FK_album_uri" FOREIGN KEY ("album_uri") REFERENCES "album"("album_uri") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist_album" DROP CONSTRAINT "FK_album_uri"`);
        await queryRunner.query(`ALTER TABLE "artist_album" DROP CONSTRAINT "FK_artist_uri"`);
        await queryRunner.query(`ALTER TABLE "artist_album" ADD CONSTRAINT "FK_0d931eb3968ff224ce440a09cab" FOREIGN KEY ("artist_uri") REFERENCES "artist_data"("artist_uri") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "artist_album" ADD CONSTRAINT "FK_2519b47476b474918db1f9b491a" FOREIGN KEY ("album_uri") REFERENCES "album"("album_uri") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
