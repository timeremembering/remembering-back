import { MigrationInterface, QueryRunner } from "typeorm";

export class createCasketPricing1708352788180 implements MigrationInterface {
    name = 'createCasketPricing1708352788180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."casket_pricing_type_enum" AS ENUM('default', 'premium')`);
        await queryRunner.query(`CREATE TYPE "public"."casket_pricing_currency_enum" AS ENUM('usd', 'pln', 'uah')`);
        await queryRunner.query(`CREATE TABLE "casket_pricing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."casket_pricing_type_enum" NOT NULL, "price" integer NOT NULL, "currency" "public"."casket_pricing_currency_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0fec5aa77054eb92d8de2f8be69" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "casket_pricing"`);
        await queryRunner.query(`DROP TYPE "public"."casket_pricing_currency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."casket_pricing_type_enum"`);
    }

}
