import { MigrationInterface, QueryRunner } from "typeorm";

export class RenamePlaycountTrackProperty1703793482897 implements MigrationInterface {
    name = 'RenamePlaycountTrackProperty1703793482897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playcount" DROP CONSTRAINT "FK_3d616c41f9591588de14aaee703"`);
        await queryRunner.query(`EXEC sp_rename "model.dbo.playcount.uriTrackUri", "trackTrackUri"`);
        await queryRunner.query(`ALTER TABLE "playcount" DROP COLUMN "trackTrackUri"`);
        await queryRunner.query(`ALTER TABLE "playcount" ADD "trackTrackUri" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "playcount" ADD CONSTRAINT "FK_0c4b833f0bc7df388346df85861" FOREIGN KEY ("trackTrackUri") REFERENCES "track"("track_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playcount" DROP CONSTRAINT "FK_0c4b833f0bc7df388346df85861"`);
        await queryRunner.query(`ALTER TABLE "playcount" DROP COLUMN "trackTrackUri"`);
        await queryRunner.query(`ALTER TABLE "playcount" ADD "trackTrackUri" nvarchar(255)`);
        await queryRunner.query(`EXEC sp_rename "model.dbo.playcount.trackTrackUri", "uriTrackUri"`);
        await queryRunner.query(`ALTER TABLE "playcount" ADD CONSTRAINT "FK_3d616c41f9591588de14aaee703" FOREIGN KEY ("uriTrackUri") REFERENCES "track"("track_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
