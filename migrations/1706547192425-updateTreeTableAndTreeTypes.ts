import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTreeTableAndTreeTypes1706547192425 implements MigrationInterface {
    name = 'updateTreeTableAndTreeTypes1706547192425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree_slot" DROP CONSTRAINT "FK_ab946bcb1a1414e30b14b8f0dbb"`);
        await queryRunner.query(`ALTER TABLE "tree_type" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "tree" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "tree" ADD CONSTRAINT "FK_9e6b093c51a3008c8ef4184e433" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tree_slot" ADD CONSTRAINT "FK_ab946bcb1a1414e30b14b8f0dbb" FOREIGN KEY ("treeId") REFERENCES "tree"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree_slot" DROP CONSTRAINT "FK_ab946bcb1a1414e30b14b8f0dbb"`);
        await queryRunner.query(`ALTER TABLE "tree" DROP CONSTRAINT "FK_9e6b093c51a3008c8ef4184e433"`);
        await queryRunner.query(`ALTER TABLE "tree" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "tree_type" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "tree_slot" ADD CONSTRAINT "FK_ab946bcb1a1414e30b14b8f0dbb" FOREIGN KEY ("treeId") REFERENCES "tree"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
