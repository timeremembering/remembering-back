import { MigrationInterface, QueryRunner } from "typeorm";

export class passTree1707389715355 implements MigrationInterface {
    name = 'passTree1707389715355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree" ADD "password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree" DROP COLUMN "password"`);
    }

}
