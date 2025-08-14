import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticleUsersTable1755162249954
  implements MigrationInterface
{
  name = 'CreateArticleUsersTable1755162249954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "article_users" (
                "article_id" integer NOT NULL,
                "user_id" integer NOT NULL,
                CONSTRAINT "PK_bb5127f4ce80cd33fbdd533b619" PRIMARY KEY ("article_id", "user_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_d9ee43b2eb8ef9b9f53973fd5c" ON "article_users" ("article_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_85f83f25c63b46fc14b7ac23ca" ON "article_users" ("user_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "article_users"
            ADD CONSTRAINT "FK_d9ee43b2eb8ef9b9f53973fd5c7" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "article_users"
            ADD CONSTRAINT "FK_85f83f25c63b46fc14b7ac23ca6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "article_users" DROP CONSTRAINT "FK_85f83f25c63b46fc14b7ac23ca6"
        `);
    await queryRunner.query(`
            ALTER TABLE "article_users" DROP CONSTRAINT "FK_d9ee43b2eb8ef9b9f53973fd5c7"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_85f83f25c63b46fc14b7ac23ca"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_d9ee43b2eb8ef9b9f53973fd5c"
        `);
    await queryRunner.query(`
            DROP TABLE "article_users"
        `);
  }
}
