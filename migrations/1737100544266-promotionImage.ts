import { MigrationInterface, QueryRunner } from "typeorm";

export class promotionImage1737100544266 implements MigrationInterface {
    name = 'promotionImage1737100544266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "promotionImage" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "promotionImage"`);
    }

}
