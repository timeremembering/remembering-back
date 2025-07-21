import { MigrationInterface, QueryRunner } from "typeorm";

export class init1706542807605 implements MigrationInterface {
    name = 'init1706542807605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tree_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" integer NOT NULL, "photo_limit" integer NOT NULL, "video_limit" integer NOT NULL, "audio_limit" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0ef2541d22dcc522320a26c6c4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tree" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "full_name" character varying NOT NULL, "date_of_birth" TIMESTAMP WITH TIME ZONE NOT NULL, "date_of_dead" TIMESTAMP WITH TIME ZONE NOT NULL, "description" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "typeId" uuid, CONSTRAINT "PK_5d87d89552132eac0a897623064" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tree_slot_file_type_enum" AS ENUM('PHOTO', 'VIDEO', 'AUDIO')`);
        await queryRunner.query(`CREATE TABLE "tree_slot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "index" integer NOT NULL, "file_type" "public"."tree_slot_file_type_enum" NOT NULL, "link" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "treeId" uuid, CONSTRAINT "PK_1cdef115dcbf37742c45e159c8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tree" ADD CONSTRAINT "FK_54f738d348cd59c881cf55d7ba6" FOREIGN KEY ("typeId") REFERENCES "tree_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tree_slot" ADD CONSTRAINT "FK_ab946bcb1a1414e30b14b8f0dbb" FOREIGN KEY ("treeId") REFERENCES "tree"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tree_slot" DROP CONSTRAINT "FK_ab946bcb1a1414e30b14b8f0dbb"`);
        await queryRunner.query(`ALTER TABLE "tree" DROP CONSTRAINT "FK_54f738d348cd59c881cf55d7ba6"`);
        await queryRunner.query(`DROP TABLE "tree_slot"`);
        await queryRunner.query(`DROP TYPE "public"."tree_slot_file_type_enum"`);
        await queryRunner.query(`DROP TABLE "tree"`);
        await queryRunner.query(`DROP TABLE "tree_type"`);
    }

}
