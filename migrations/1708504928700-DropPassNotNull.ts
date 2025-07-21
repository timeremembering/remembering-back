import { MigrationInterface, QueryRunner } from "typeorm";

export class DropPassNotNull1708504928700 implements MigrationInterface {
    name = 'DropPassNotNull1708504928700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "password" SET NOT NULL`);
    }

}
