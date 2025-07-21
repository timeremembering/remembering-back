import { MigrationInterface, QueryRunner } from "typeorm";

export class plateName1734697418068 implements MigrationInterface {
    name = 'plateName1734697418068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "plateName" character varying(200) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "plateName"`);
    }

}
