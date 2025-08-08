import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticleTable1754625793111 implements MigrationInterface {
  name = 'CreateArticleTable1754625793111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "articles" (
                "id" SERIAL NOT NULL,
                "slug" character varying NOT NULL,
                "title" character varying NOT NULL,
                "body" character varying NOT NULL,
                "description" character varying NOT NULL,
                "author_id" integer,
                CONSTRAINT "PK_article_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_article_slug" ON "articles" ("slug")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_article_title" ON "articles" ("title")
        `);
    await queryRunner.query(`
            ALTER TABLE "articles"
            ADD CONSTRAINT "FK_article_author_id" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "articles" DROP CONSTRAINT "FK_article_author_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."UQ_article_title"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."UQ_article_slug"
        `);
    await queryRunner.query(`
            DROP TABLE "articles"
        `);
  }
}
