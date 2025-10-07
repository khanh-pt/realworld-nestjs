#!/usr/bin/env ts-node

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { config } from 'dotenv';
import { AppDataSource } from '../database/data-source';

// Load environment variables
config();

// Define types for database query results
interface CountResult {
  count: string;
}

interface UserResult {
  username: string;
  email: string;
  bio: string;
}

interface ArticleResult {
  title: string;
  slug: string;
  author: string;
}

interface TagResult {
  name: string;
  article_count: string;
}

interface EngagementResult {
  avg_comments_per_article: string;
  avg_favorites_per_article: string;
}

async function showSeedSummary() {
  console.log('📊 Database Seed Summary\n');

  try {
    await AppDataSource.initialize();

    // Count records in each table
    const userCount = await AppDataSource.query(
      'SELECT COUNT(*) as count FROM users',
    );
    const tagCount = await AppDataSource.query(
      'SELECT COUNT(*) as count FROM tags',
    );
    const articleCount = await AppDataSource.query(
      'SELECT COUNT(*) as count FROM articles',
    );
    const commentCount = await AppDataSource.query(
      'SELECT COUNT(*) as count FROM comments',
    );
    const followCount = await AppDataSource.query(
      'SELECT COUNT(*) as count FROM follows',
    );
    const favoriteCount = await AppDataSource.query(
      'SELECT COUNT(*) as count FROM article_users',
    );
    const articleTagCount = await AppDataSource.query(
      'SELECT COUNT(*) as count FROM article_tags',
    );

    console.log('📈 Record Counts:');
    console.log(`👥 Users: ${userCount[0].count}`);
    console.log(`🏷️  Tags: ${tagCount[0].count}`);
    console.log(`📝 Articles: ${articleCount[0].count}`);
    console.log(`💬 Comments: ${commentCount[0].count}`);
    console.log(`👥 Follows: ${followCount[0].count}`);
    console.log(`❤️  Favorites: ${favoriteCount[0].count}`);
    console.log(`🔗 Article-Tag Relations: ${articleTagCount[0].count}`);

    console.log('\n👤 Sample Users:');
    const sampleUsers = await AppDataSource.query(`
      SELECT username, email, bio
      FROM users
      ORDER BY id
      LIMIT 3
    `);
    sampleUsers.forEach((user: UserResult) => {
      console.log(`  • ${user.username} (${user.email})`);
      console.log(`    ${user.bio.substring(0, 60)}...`);
    });
    console.log('\n📰 Sample Articles:');
    const sampleArticles = await AppDataSource.query(`
      SELECT a.title, a.slug, u.username as author
      FROM articles a
      JOIN users u ON a.author_id = u.id
      ORDER BY a.id
      LIMIT 3
    `);
    sampleArticles.forEach((article: ArticleResult) => {
      console.log(`  • "${article.title}"`);
      console.log(`    by ${article.author} (${article.slug})`);
    });

    console.log('\n🏷️ Popular Tags:');
    const popularTags = await AppDataSource.query(`
      SELECT t.name, COUNT(at.article_id) as article_count
      FROM tags t
      LEFT JOIN article_tags at ON t.id = at.tag_id
      GROUP BY t.id, t.name
      ORDER BY article_count DESC, t.name
      LIMIT 10
    `);
    popularTags.forEach((tag: TagResult) => {
      console.log(`  • ${tag.name} (${tag.article_count} articles)`);
    });

    console.log('\n📊 Engagement Stats:');
    const engagementStats = await AppDataSource.query(`
      SELECT
        AVG(comment_count) as avg_comments_per_article,
        AVG(favorite_count) as avg_favorites_per_article
      FROM (
        SELECT
          a.id,
          COUNT(DISTINCT c.id) as comment_count,
          COUNT(DISTINCT au.user_id) as favorite_count
        FROM articles a
        LEFT JOIN comments c ON a.id = c.article_id
        LEFT JOIN article_users au ON a.id = au.article_id
        GROUP BY a.id
      ) stats
    `);

    console.log(
      `  • Average comments per article: ${parseFloat(engagementStats[0].avg_comments_per_article).toFixed(1)}`,
    );
    console.log(
      `  • Average favorites per article: ${parseFloat(engagementStats[0].avg_favorites_per_article).toFixed(1)}`,
    );

    console.log(
      '\n✅ Database successfully seeded with realistic development data!',
    );
    console.log('\n🚀 Ready for development and testing!');
  } catch (error) {
    console.error('❌ Error fetching seed summary:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run if called directly
if (require.main === module) {
  void showSeedSummary()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Failed to show seed summary:', error);
      process.exit(1);
    });
}

export { showSeedSummary };
