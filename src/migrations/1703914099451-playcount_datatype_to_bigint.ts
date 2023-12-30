import { MigrationInterface, QueryRunner } from "typeorm"

export class PlaycountDatatypeToBigint1703914099451 implements MigrationInterface {
    name = 'PlaycountDatatypeToBigint1703914099451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playcount" ALTER COLUMN "playcount" bigint`);
        await queryRunner.query(`ALTER TABLE "playcount" ALTER COLUMN "date" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playcount" ALTER COLUMN "playcount" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "playcount" ALTER COLUMN "date" nvarchar(255)`);
    }

}
