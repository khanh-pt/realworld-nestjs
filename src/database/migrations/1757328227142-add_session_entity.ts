import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSessionEntity1757328227142 implements MigrationInterface {
  name = 'AddSessionEntity1757328227142';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "sessions" (
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "hash" character varying NOT NULL,
                CONSTRAINT "PK_session_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_session_hash" ON "sessions" ("hash")
        `);
    await queryRunner.query(`
            ALTER TABLE "sessions"
            ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."UQ_session_hash"
        `);
    await queryRunner.query(`
            DROP TABLE "sessions"
        `);
  }
}
