import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFileTable1757669864925 implements MigrationInterface {
  name = 'CreateFileTable1757669864925';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "files" (
                "id" SERIAL NOT NULL,
                "key" character varying NOT NULL,
                "filename" character varying NOT NULL,
                "content_type" character varying NOT NULL,
                "metadata" jsonb,
                "service_name" character varying NOT NULL,
                "byte_size" integer NOT NULL,
                "checksum" character varying NOT NULL,
                CONSTRAINT "PK_file_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_file_key" ON "files" ("key")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."UQ_file_key"
        `);
    await queryRunner.query(`
            DROP TABLE "files"
        `);
  }
}
