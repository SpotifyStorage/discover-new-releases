import { MigrationInterface, QueryRunner } from "typeorm";

export class OndeleteCascade1704249519521 implements MigrationInterface {
    name = 'OndeleteCascade1704249519521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist_stats" DROP CONSTRAINT "FK_a318ca696b744f767f3b008a754"`);
        await queryRunner.query(`ALTER TABLE "artist_stats" ADD CONSTRAINT "FK_a318ca696b744f767f3b008a754" FOREIGN KEY ("artist_uri") REFERENCES "artist_data"("artist_uri") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_a60e7d037d4dce10eb3a016f631"`);
        await queryRunner.query(`ALTER TABLE "album" ADD CONSTRAINT "FK_a60e7d037d4dce10eb3a016f631" FOREIGN KEY ("artistArtistUri") REFERENCES "artist_data"("artist_uri") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_stats" DROP CONSTRAINT "FK_9777cff976bad6ca6de2ec963b7"`);
        await queryRunner.query(`ALTER TABLE "track_data" DROP CONSTRAINT "FK_ca1eca98694669d4d646cda1b39"`);
        await queryRunner.query(`ALTER TABLE "track_stats" ADD CONSTRAINT "FK_9777cff976bad6ca6de2ec963b7" FOREIGN KEY ("track_uri") REFERENCES "track_data"("track_uri") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_data" ADD CONSTRAINT "FK_ca1eca98694669d4d646cda1b39" FOREIGN KEY ("album_uri") REFERENCES "album"("album_uri") ON DELETE CASCADE ON UPDATE NO ACTION`);
   }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "artist_stats" DROP CONSTRAINT "FK_a318ca696b744f767f3b008a754"`);
        await queryRunner.query(`ALTER TABLE "artist_stats" ADD CONSTRAINT "FK_a318ca696b744f767f3b008a754" FOREIGN KEY ("artist_uri") REFERENCES "artist_data"("artist_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_a60e7d037d4dce10eb3a016f631"`);
        await queryRunner.query(`ALTER TABLE "album" ADD CONSTRAINT "FK_a60e7d037d4dce10eb3a016f631" FOREIGN KEY ("artistArtistUri") REFERENCES "artist_data"("artist_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_data" DROP CONSTRAINT "FK_ca1eca98694669d4d646cda1b39"`);
        await queryRunner.query(`ALTER TABLE "track_stats" DROP CONSTRAINT "FK_9777cff976bad6ca6de2ec963b7"`);
        await queryRunner.query(`ALTER TABLE "track_data" ADD CONSTRAINT "FK_ca1eca98694669d4d646cda1b39" FOREIGN KEY ("album_uri") REFERENCES "album"("album_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_stats" ADD CONSTRAINT "FK_9777cff976bad6ca6de2ec963b7" FOREIGN KEY ("track_uri") REFERENCES "track_data"("track_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
   }

}
