import { MigrationInterface, QueryRunner } from "typeorm";

export class RenamePlaycountTable1703746354150 implements MigrationInterface {
    name = 'RenamePlaycountTable1703746354150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "playcount" ("id" int NOT NULL IDENTITY(1,1), "playcount" int NOT NULL, "date" nvarchar(255) NOT NULL, "uriTrackUri" nvarchar(255), CONSTRAINT "PK_6447c8c4e19230a4a835cb8096f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "playcount" ADD CONSTRAINT "FK_3d616c41f9591588de14aaee703" FOREIGN KEY ("uriTrackUri") REFERENCES "track"("track_uri") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playcount" DROP CONSTRAINT "FK_3d616c41f9591588de14aaee703"`);
        await queryRunner.query(`DROP TABLE "playcount"`);
    }

}
