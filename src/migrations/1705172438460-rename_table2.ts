import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTable21705172438460 implements MigrationInterface {
    name = 'RenameTable21705172438460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist_album" DROP CONSTRAINT "FK_2519b47476b474918db1f9b491a"`);
        await queryRunner.query(`ALTER TABLE "artist_album" ADD CONSTRAINT "FK_2519b47476b474918db1f9b491a" FOREIGN KEY ("album_uri") REFERENCES "album"("album_uri") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist_album" DROP CONSTRAINT "FK_2519b47476b474918db1f9b491a"`);
        await queryRunner.query(`ALTER TABLE "artist_album" ADD CONSTRAINT "FK_2519b47476b474918db1f9b491a" FOREIGN KEY ("album_uri") REFERENCES "album"("album_uri") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
