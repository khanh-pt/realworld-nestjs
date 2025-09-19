import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnCreatedAtUpdatedAtAndIndexChecksumForFileTable1758017090838
  implements MigrationInterface
{
  name = 'AddColumnCreatedAtUpdatedAtAndIndexChecksumForFileTable1758017090838';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "files"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "files"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_file_checksum" ON "files" ("checksum")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_file_checksum"
        `);
    await queryRunner.query(`
            ALTER TABLE "files" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "files" DROP COLUMN "created_at"
        `);
  }
}
