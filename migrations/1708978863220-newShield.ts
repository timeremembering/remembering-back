import { MigrationInterface, QueryRunner } from "typeorm";

export class newShield1708978863220 implements MigrationInterface {
    name = 'newShield1708978863220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "hearAbout" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "hearAbout"`);
    }

}
