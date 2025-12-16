import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1765857036020 implements MigrationInterface {
  name = 'Test1765857036020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE SEQUENCE IF NOT EXISTS "article_files_id_seq" OWNED BY "article_files"."id"
    `);
    await queryRunner.query(`
      ALTER TABLE "article_files"
      ALTER COLUMN "id"
      SET DEFAULT nextval('"article_files_id_seq"')
    `);
    await queryRunner.query(`
      ALTER TABLE "article_files"
      ADD CONSTRAINT "FK_db7ae42c36aae1bd1a03b79890a" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "article_files" DROP CONSTRAINT "FK_db7ae42c36aae1bd1a03b79890a"
    `);
    await queryRunner.query(`
      ALTER TABLE "article_files"
      ALTER COLUMN "id" DROP DEFAULT
    `);
    await queryRunner.query(`
      DROP SEQUENCE "article_files_id_seq"
    `);
  }
}
