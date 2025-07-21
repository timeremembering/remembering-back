import { MigrationInterface, QueryRunner } from "typeorm";

export class addFieldForTransaction1708442033679 implements MigrationInterface {
    name = 'addFieldForTransaction1708442033679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "giftAddress" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "giftAddress"`);
    }

}
