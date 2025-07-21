import { MigrationInterface, QueryRunner } from "typeorm";

export class createRefferralTable1706691773143 implements MigrationInterface {
    name = 'createRefferralTable1706691773143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "referral" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "referredId" character varying NOT NULL, "full_name" character varying NOT NULL, "isPurchaseMade" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "referrerId" uuid, CONSTRAINT "PK_a2d3e935a6591168066defec5ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "FK_ec295d220eaab068ed5147e8582" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "FK_ec295d220eaab068ed5147e8582"`);
        await queryRunner.query(`DROP TABLE "referral"`);
    }

}
