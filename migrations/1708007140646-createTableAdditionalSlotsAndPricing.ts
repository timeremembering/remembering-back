import { MigrationInterface, QueryRunner } from "typeorm";

export class createTableAdditionalSlotsAndPricing1708007140646 implements MigrationInterface {
    name = 'createTableAdditionalSlotsAndPricing1708007140646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "additional_tree_slots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "count_of_slots" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "treeId" uuid, CONSTRAINT "REL_4e7e7e965e7f623f3f2aab9fa4" UNIQUE ("treeId"), CONSTRAINT "PK_85bfb78f88b71407f5ef35277ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."additional_slots_pricing_file_type_enum" AS ENUM('PHOTO', 'VIDEO', 'AUDIO')`);
        await queryRunner.query(`CREATE TYPE "public"."additional_slots_pricing_currency_enum" AS ENUM('usd', 'pln', 'uah')`);
        await queryRunner.query(`CREATE TABLE "additional_slots_pricing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "file_type" "public"."additional_slots_pricing_file_type_enum" NOT NULL, "currency" "public"."additional_slots_pricing_currency_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_147d5cce049e881f148040f019a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tree" ADD "additionalSlotsId" uuid`);
        await queryRunner.query(`ALTER TABLE "tree" ADD CONSTRAINT "UQ_899dbd4c53881f1162130bd3b4e" UNIQUE ("additionalSlotsId")`);
        await queryRunner.query(`ALTER TABLE "additional_tree_slots" ADD CONSTRAINT "FK_4e7e7e965e7f623f3f2aab9fa4f" FOREIGN KEY ("treeId") REFERENCES "tree"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tree" ADD CONSTRAINT "FK_899dbd4c53881f1162130bd3b4e" FOREIGN KEY ("additionalSlotsId") REFERENCES "additional_tree_slots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree" DROP CONSTRAINT "FK_899dbd4c53881f1162130bd3b4e"`);
        await queryRunner.query(`ALTER TABLE "additional_tree_slots" DROP CONSTRAINT "FK_4e7e7e965e7f623f3f2aab9fa4f"`);
        await queryRunner.query(`ALTER TABLE "tree" DROP CONSTRAINT "UQ_899dbd4c53881f1162130bd3b4e"`);
        await queryRunner.query(`ALTER TABLE "tree" DROP COLUMN "additionalSlotsId"`);
        await queryRunner.query(`DROP TABLE "additional_slots_pricing"`);
        await queryRunner.query(`DROP TYPE "public"."additional_slots_pricing_currency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."additional_slots_pricing_file_type_enum"`);
        await queryRunner.query(`DROP TABLE "additional_tree_slots"`);
    }

}
