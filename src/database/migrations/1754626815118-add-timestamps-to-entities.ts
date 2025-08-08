import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestampsToEntities1754626815118
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "articles"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "articles"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "follows"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "follows"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "follows" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "follows" DROP COLUMN "created_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "created_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "articles" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "articles" DROP COLUMN "created_at"
        `);
  }
}
