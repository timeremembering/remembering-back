import { MigrationInterface, QueryRunner } from "typeorm";

export class addFieldAvailableSlotsForTree1708002414117 implements MigrationInterface {
    name = 'addFieldAvailableSlotsForTree1708002414117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree" ADD "available_slot" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree" DROP COLUMN "available_slot"`);
    }

}
