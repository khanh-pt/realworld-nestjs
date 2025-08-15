import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommentTable1755246414218 implements MigrationInterface {
  name = 'CreateCommentTable1755246414218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "comments" (
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "body" text NOT NULL,
                "article_id" integer,
                "author_id" integer,
                CONSTRAINT "PK_comment_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_comment_article_id" ON "comments" ("article_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_comment_author_id" ON "comments" ("author_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_e9b498cca509147e73808f9e593" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_e6d38899c31997c45d128a8973b" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_e6d38899c31997c45d128a8973b"
        `);
    await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_e9b498cca509147e73808f9e593"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_comment_author_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_comment_article_id"
        `);
    await queryRunner.query(`
            DROP TABLE "comments"
        `);
  }
}
