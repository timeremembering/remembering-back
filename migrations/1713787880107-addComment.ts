import { MigrationInterface, QueryRunner } from "typeorm";

export class addComment1713787880107 implements MigrationInterface {
    name = 'addComment1713787880107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree_slot" ADD "comment_title" character varying`);
        await queryRunner.query(`ALTER TABLE "tree_slot" ADD "comment_text" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree_slot" DROP COLUMN "comment_text"`);
        await queryRunner.query(`ALTER TABLE "tree_slot" DROP COLUMN "comment_title"`);
    }

}
