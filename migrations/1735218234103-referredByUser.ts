import { MigrationInterface, QueryRunner } from "typeorm";

export class referredByUser1735218234103 implements MigrationInterface {
    name = 'referredByUser1735218234103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_1142607b5a447cd5ce23ef7798f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_1142607b5a447cd5ce23ef7798f"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_1142607b5a447cd5ce23ef7798f" FOREIGN KEY ("referredById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_1142607b5a447cd5ce23ef7798f"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_1142607b5a447cd5ce23ef7798f" UNIQUE ("referredById")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_1142607b5a447cd5ce23ef7798f" FOREIGN KEY ("referredById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
