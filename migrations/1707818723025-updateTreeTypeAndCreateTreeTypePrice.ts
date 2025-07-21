import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTreeTypeAndCreateTreeTypePrice1707818723025
    implements MigrationInterface
{
    name = 'updateTreeTypeAndCreateTreeTypePrice1707818723025';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."tree_type_price_currency_enum" AS ENUM('usd', 'pln', 'uah')`,
        );
        await queryRunner.query(
            `CREATE TABLE "tree_type_price" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" double precision NOT NULL, "currency" "public"."tree_type_price_currency_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "treeTypeId" uuid, CONSTRAINT "PK_d14b76aec5c50638b184a531c5b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`ALTER TABLE "tree_type" DROP COLUMN "price"`);
        await queryRunner.query(
            `ALTER TABLE "tree_type_price" ADD CONSTRAINT "FK_b4ba9200a2d15ced5d8eeccc7e3" FOREIGN KEY ("treeTypeId") REFERENCES "tree_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tree_type_price" DROP CONSTRAINT "FK_b4ba9200a2d15ced5d8eeccc7e3"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tree_type" ADD "price" integer NOT NULL`,
        );
        await queryRunner.query(`DROP TABLE "tree_type_price"`);
        await queryRunner.query(
            `DROP TYPE "public"."tree_type_price_currency_enum"`,
        );
    }
}
