import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticleTagsTable1754640954543 implements MigrationInterface {
  name = 'CreateArticleTagsTable1754640954543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "article_tags" (
                "article_id" integer NOT NULL,
                "tag_id" integer NOT NULL,
                CONSTRAINT "PK_dd79accc42e2f122f6f3ff7588a" PRIMARY KEY ("article_id", "tag_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_f8c9234a4c4cb37806387f0c9e" ON "article_tags" ("article_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_1325dd0b98ee0f8f673db6ce19" ON "article_tags" ("tag_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "article_tags"
            ADD CONSTRAINT "FK_f8c9234a4c4cb37806387f0c9e9" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "article_tags"
            ADD CONSTRAINT "FK_1325dd0b98ee0f8f673db6ce194" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "article_tags" DROP CONSTRAINT "FK_1325dd0b98ee0f8f673db6ce194"
        `);
    await queryRunner.query(`
            ALTER TABLE "article_tags" DROP CONSTRAINT "FK_f8c9234a4c4cb37806387f0c9e9"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_1325dd0b98ee0f8f673db6ce19"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_f8c9234a4c4cb37806387f0c9e"
        `);
    await queryRunner.query(`
            DROP TABLE "article_tags"
        `);
  }
}
