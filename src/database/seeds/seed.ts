import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';
import { UserSeeder } from './user.seeder';
import { TagSeeder } from './tag.seeder';
import { ArticleSeeder } from './article.seeder';
import { CommentSeeder } from './comment.seeder';
import { FollowSeeder } from './follow.seeder';

export class DatabaseSeeder {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = AppDataSource;
  }

  async seed(): Promise<void> {
    try {
      console.log('🌱 Starting database seeding...');

      await this.dataSource.initialize();
      console.log('✅ Database connection established');

      // Clear existing data (in reverse order of dependencies)
      await this.clearData();

      // Seed data (in order of dependencies)
      await this.seedData();

      console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    } finally {
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
      }
    }
  }

  private async clearData(): Promise<void> {
    console.log('🧹 Clearing existing data...');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Clear tables in reverse dependency order
      await queryRunner.query(
        'TRUNCATE TABLE comments RESTART IDENTITY CASCADE',
      );
      await queryRunner.query(
        'TRUNCATE TABLE article_users RESTART IDENTITY CASCADE',
      );
      await queryRunner.query(
        'TRUNCATE TABLE article_tags RESTART IDENTITY CASCADE',
      );
      await queryRunner.query(
        'TRUNCATE TABLE follows RESTART IDENTITY CASCADE',
      );
      await queryRunner.query(
        'TRUNCATE TABLE articles RESTART IDENTITY CASCADE',
      );
      await queryRunner.query('TRUNCATE TABLE tags RESTART IDENTITY CASCADE');
      await queryRunner.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

      console.log('✅ Existing data cleared');
    } finally {
      await queryRunner.release();
    }
  }

  private async seedData(): Promise<void> {
    console.log('🌱 Seeding fresh data...');

    // Seed in order of dependencies
    const userSeeder = new UserSeeder(this.dataSource);
    const users = await userSeeder.seed();
    console.log('✅ Users seeded');

    const tagSeeder = new TagSeeder(this.dataSource);
    const tags = await tagSeeder.seed();
    console.log('✅ Tags seeded');

    const articleSeeder = new ArticleSeeder(this.dataSource);
    const articles = await articleSeeder.seed(users, tags);
    console.log('✅ Articles seeded');

    const commentSeeder = new CommentSeeder(this.dataSource);
    await commentSeeder.seed(users, articles);
    console.log('✅ Comments seeded');

    const followSeeder = new FollowSeeder(this.dataSource);
    await followSeeder.seed(users);
    console.log('✅ Follows seeded');
  }
}

// Run seeder if called directly
if (require.main === module) {
  const seeder = new DatabaseSeeder();
  seeder
    .seed()
    .then(() => {
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}
