import { MigrationInterface, QueryRunner } from "typeorm";

export class updatePricingTable1708007821101 implements MigrationInterface {
    name = 'updatePricingTable1708007821101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "additional_slots_pricing" ADD "price" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "additional_slots_pricing" DROP COLUMN "price"`);
    }

}
