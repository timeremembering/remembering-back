import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTransaction1708001423128 implements MigrationInterface {
    name = 'updateTransaction1708001423128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "address" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "address"`);
    }

}
