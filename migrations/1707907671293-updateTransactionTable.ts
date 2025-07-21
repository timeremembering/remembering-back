import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTransactionTable1707907671293 implements MigrationInterface {
    name = 'updateTransactionTable1707907671293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "is_gift" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "giftName" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "giftLastName" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "giftAddress" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_language_enum" AS ENUM('ua', 'pl', 'en')`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "language" "public"."transaction_language_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "typeId" uuid`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_45f62a7f98171c11f05253040bb" FOREIGN KEY ("typeId") REFERENCES "tree_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_45f62a7f98171c11f05253040bb"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "typeId"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "language"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_language_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "giftAddress"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "giftLastName"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "giftName"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "is_gift"`);
    }

}
