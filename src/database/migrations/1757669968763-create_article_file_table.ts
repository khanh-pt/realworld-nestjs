import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticleFileTable1757669968763 implements MigrationInterface {
  name = 'CreateArticleFileTable1757669968763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "article_files" (
                "id" integer NOT NULL,
                "article_id" integer NOT NULL,
                "file_id" integer NOT NULL,
                "role" character varying NOT NULL,
                CONSTRAINT "PK_article_file" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_article_file_article_id" ON "article_files" ("article_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_article_file_file_id" ON "article_files" ("file_id")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_article_file" ON "article_files" ("article_id", "file_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."UQ_article_file"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_article_file_file_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_article_file_article_id"
        `);
    await queryRunner.query(`
            DROP TABLE "article_files"
        `);
  }
}
