import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeOfAlbum1704906581219 implements MigrationInterface {
    name = 'AddTypeOfAlbum1704906581219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album" ADD "type" nvarchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "type"`);
    }

}
