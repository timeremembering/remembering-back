import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTreeTable1706633048832 implements MigrationInterface {
    name = 'updateTreeTable1706633048832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree_slot" RENAME COLUMN "file_type" TO "slot_type"`);
        await queryRunner.query(`ALTER TYPE "public"."tree_slot_file_type_enum" RENAME TO "tree_slot_slot_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."tree_slot_slot_type_enum" RENAME TO "tree_slot_file_type_enum"`);
        await queryRunner.query(`ALTER TABLE "tree_slot" RENAME COLUMN "slot_type" TO "file_type"`);
    }

}
