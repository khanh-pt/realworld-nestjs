import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFollowTable1754462817086 implements MigrationInterface {
  name = 'CreateFollowTable1754462817086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "follows" (
                "id" SERIAL NOT NULL,
                "follower_id" integer NOT NULL,
                "following_id" integer NOT NULL,
                CONSTRAINT "CHK_follow_not_self" CHECK ("follower_id" != "following_id"),
                CONSTRAINT "PK_follow_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_follow_follower_id" ON "follows" ("follower_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_follow_following_id" ON "follows" ("following_id")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_follow_follower_following" ON "follows" ("follower_id", "following_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_follow_follower_following"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_follow_following_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_follow_follower_id"
        `);
    await queryRunner.query(`
            DROP TABLE "follows"
        `);
  }
}
