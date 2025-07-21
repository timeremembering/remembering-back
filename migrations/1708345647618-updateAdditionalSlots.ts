import { MigrationInterface, QueryRunner } from "typeorm";

export class updateAdditionalSlots1708345647618 implements MigrationInterface {
    name = 'updateAdditionalSlots1708345647618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree" DROP CONSTRAINT "FK_899dbd4c53881f1162130bd3b4e"`);
        await queryRunner.query(`ALTER TABLE "tree" DROP CONSTRAINT "UQ_899dbd4c53881f1162130bd3b4e"`);
        await queryRunner.query(`ALTER TABLE "tree" DROP COLUMN "additionalSlotsId"`);
        await queryRunner.query(`CREATE TYPE "public"."additional_tree_slots_file_type_enum" AS ENUM('PHOTO', 'VIDEO', 'AUDIO')`);
        await queryRunner.query(`ALTER TABLE "additional_tree_slots" ADD "file_type" "public"."additional_tree_slots_file_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "additional_tree_slots" DROP CONSTRAINT "FK_4e7e7e965e7f623f3f2aab9fa4f"`);
        await queryRunner.query(`ALTER TABLE "additional_tree_slots" DROP CONSTRAINT "REL_4e7e7e965e7f623f3f2aab9fa4"`);
        await queryRunner.query(`ALTER TABLE "additional_tree_slots" ADD CONSTRAINT "FK_4e7e7e965e7f623f3f2aab9fa4f" FOREIGN KEY ("treeId") REFERENCES "tree"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "additional_tree_slots" DROP CONSTRAINT "FK_4e7e7e965e7f623f3f2aab9fa4f"`);
        await queryRunner.query(`ALTER TABLE "additional_tree_slots" ADD CONSTRAINT "REL_4e7e7e965e7f623f3f2aab9fa4" UNIQUE ("treeId")`);
        await queryRunner.query(`ALTER TABLE "additional_tree_slots" ADD CONSTRAINT "FK_4e7e7e965e7f623f3f2aab9fa4f" FOREIGN KEY ("treeId") REFERENCES "tree"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "additional_tree_slots" DROP COLUMN "file_type"`);
        await queryRunner.query(`DROP TYPE "public"."additional_tree_slots_file_type_enum"`);
        await queryRunner.query(`ALTER TABLE "tree" ADD "additionalSlotsId" uuid`);
        await queryRunner.query(`ALTER TABLE "tree" ADD CONSTRAINT "UQ_899dbd4c53881f1162130bd3b4e" UNIQUE ("additionalSlotsId")`);
        await queryRunner.query(`ALTER TABLE "tree" ADD CONSTRAINT "FK_899dbd4c53881f1162130bd3b4e" FOREIGN KEY ("additionalSlotsId") REFERENCES "additional_tree_slots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
