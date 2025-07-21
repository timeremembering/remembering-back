import { MigrationInterface, QueryRunner } from "typeorm";

export class addedCandleTable1726175221667 implements MigrationInterface {
    name = 'addedCandleTable1726175221667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "candle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "treeid" uuid NOT NULL, "from" character varying, "wishes" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e4bfba00b826f30058f10eb59d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "album_title"`);
        await queryRunner.query(`ALTER TABLE "album" ADD "album_title" character varying`);
        await queryRunner.query(`ALTER TABLE "album" ALTER COLUMN "created_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "album" ALTER COLUMN "created_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "album" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "album" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "album_title"`);
        await queryRunner.query(`ALTER TABLE "album" ADD "album_title" character varying(255) DEFAULT NULL`);
        await queryRunner.query(`DROP TABLE "candle"`);
    }

}
