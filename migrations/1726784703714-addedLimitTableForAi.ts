import { MigrationInterface, QueryRunner } from "typeorm";

export class addedLimitTableForAi1726784703714 implements MigrationInterface {
    name = 'addedLimitTableForAi1726784703714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ai_generation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "count_of_generation" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ad99b4a9bf14f66d0b914c0d453" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ai_generation"`);
    }

}
