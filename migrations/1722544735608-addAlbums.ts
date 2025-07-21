import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAlbums1722544735608 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE album (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                index INT NOT NULL,
                album_title VARCHAR(255) DEFAULT NULL,
                treeId UUID NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE album
        `);
    }
}
