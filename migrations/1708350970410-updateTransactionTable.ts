import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTransactionTable1708350970410 implements MigrationInterface {
    name = 'updateTransactionTable1708350970410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "special_message"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "giftName"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "giftLastName"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "giftAddress"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "fullName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "middleName" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "typeOfMail" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "addressIndex" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "instructionsDelivery" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_typeofcasket_enum" AS ENUM('default', 'premium')`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "typeOfCasket" "public"."transaction_typeofcasket_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "isCasketWithImage" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "engravingBoxes" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "accountName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "dob" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "dod" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "phoneNumber" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "specialWishes" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "giftFullName" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "giftMiddleName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "giftMiddleName"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "giftFullName"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "specialWishes"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "dod"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "dob"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "accountName"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "engravingBoxes"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "isCasketWithImage"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "typeOfCasket"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_typeofcasket_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "instructionsDelivery"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "addressIndex"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "typeOfMail"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "middleName"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "giftAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "giftLastName" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "giftName" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "special_message" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "last_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "first_name" character varying NOT NULL`);
    }

}
