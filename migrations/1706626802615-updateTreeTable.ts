import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTreeTable1706626802615 implements MigrationInterface {
    name = 'updateTreeTable1706626802615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree" DROP COLUMN "date_of_birth"`);
        await queryRunner.query(`ALTER TABLE "tree" ADD "date_of_birth" character varying`);
        await queryRunner.query(`ALTER TABLE "tree" DROP COLUMN "date_of_dead"`);
        await queryRunner.query(`ALTER TABLE "tree" ADD "date_of_dead" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree" DROP COLUMN "date_of_dead"`);
        await queryRunner.query(`ALTER TABLE "tree" ADD "date_of_dead" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "tree" DROP COLUMN "date_of_birth"`);
        await queryRunner.query(`ALTER TABLE "tree" ADD "date_of_birth" TIMESTAMP WITH TIME ZONE`);
    }

}
