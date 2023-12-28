import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePlaycountDatatype1703794116824 implements MigrationInterface {
    name = 'ChangePlaycountDatatype1703794116824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playcount" DROP COLUMN "playcount"`);
        await queryRunner.query(`ALTER TABLE "playcount" ADD "playcount" nvarchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playcount" DROP COLUMN "playcount"`);
        await queryRunner.query(`ALTER TABLE "playcount" ADD "playcount" int NOT NULL`);
    }

}
