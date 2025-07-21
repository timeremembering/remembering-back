import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTreeTable1706544846474 implements MigrationInterface {
    name = 'updateTreeTable1706544846474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree" ADD "avatar" character varying`);
        await queryRunner.query(`ALTER TABLE "tree" ALTER COLUMN "date_of_birth" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tree" ALTER COLUMN "date_of_dead" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tree" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "tree" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "tree" ADD "description" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tree" ALTER COLUMN "date_of_dead" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tree" ALTER COLUMN "date_of_birth" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tree" DROP COLUMN "avatar"`);
    }

}
