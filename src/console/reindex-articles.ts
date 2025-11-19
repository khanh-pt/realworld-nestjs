#!/usr/bin/env ts-node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ArticleSearchService } from '../api/article-search/article-search.service';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../api/article/entities/article.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function reindexArticles() {
  console.log('🔍 Starting Elasticsearch article reindexing...\n');

  // Create NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const articleSearchService = app.get(ArticleSearchService);
    const articleRepository = app.get<Repository<ArticleEntity>>(
      getRepositoryToken(ArticleEntity),
    );

    console.log('📊 Fetching all articles from database...');

    // Get all articles with their relations
    const articles = await articleRepository.find({
      relations: ['author', 'tags', 'users'],
      order: { createdAt: 'DESC' },
    });

    console.log(`📦 Found ${articles.length} articles to reindex`);

    if (articles.length === 0) {
      console.log('ℹ️  No articles found to reindex');
      await app.close();
      process.exit(0);
    }

    console.log('🔄 Starting reindex process...');
    await articleSearchService.reindex(articles);
    console.log(`✅ Successfully reindexed ${articles.length} articles`);

    console.log('\n🎉 Article reindexing completed successfully!');
  } catch (error) {
    console.error('\n❌ Article reindexing failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }

  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  void reindexArticles();
}

export { reindexArticles };
