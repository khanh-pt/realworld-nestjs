import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config/config.type';
import { SearchArticlesReqDto } from './dto/search-articles.req.dto';
import {
  SearchArticlesResDto,
  ArticleSearchResult,
} from './dto/search-articles.res.dto';
import { ArticleEntity } from '../article/entities/article.entity';
import { CurrentUser } from '../../types/request.type';
import {
  SearchHit,
  SearchTotalHits,
} from '@elastic/elasticsearch/lib/api/typesWithBodyKey';

export interface ArticleDocument {
  articleId: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    username: string;
    bio: string;
    image: string;
  };
  favoritesCount: number;
  favoritedBy?: number[];
}

@Injectable()
export class ArticleSearchService {
  private readonly logger = new Logger(ArticleSearchService.name);
  private readonly indexName: string;
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    const indexName = this.configService.getOrThrow(
      'elasticsearch.articleIndex',
      {
        infer: true,
      },
    );
    this.indexName = indexName;
  }

  private async createIndex() {
    return this.elasticsearchService.indices.create({
      index: this.indexName,
      settings: {
        analysis: {
          analyzer: {
            article_analyzer: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase', 'stop', 'snowball'],
            },
          },
        },
      },
      mappings: {
        properties: {
          articleId: { type: 'integer' },
          slug: { type: 'keyword' },
          title: {
            type: 'text',
            analyzer: 'article_analyzer',
            fields: {
              keyword: { type: 'keyword' },
            },
          },
          description: {
            type: 'text',
            analyzer: 'article_analyzer',
          },
          body: {
            type: 'text',
            analyzer: 'article_analyzer',
          },
          tagList: {
            type: 'keyword',
          },
          createdAt: { type: 'date' },
          updatedAt: { type: 'date' },
          author: {
            properties: {
              id: { type: 'integer' },
              username: { type: 'keyword' },
              bio: { type: 'text' },
              image: { type: 'keyword' },
            },
          },
          favoritesCount: { type: 'integer' },
          favoritedBy: { type: 'integer' },
        },
      },
    });
  }

  async indexArticle(article: ArticleEntity): Promise<void> {
    const document: ArticleDocument = {
      articleId: article.id,
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tags?.map((tag) => tag.name) || [],
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      author: {
        id: article.author.id,
        username: article.author.username,
        bio: article.author.bio || '',
        image: article.author.image || '',
      },
      favoritesCount: article.users?.length || 0,
      favoritedBy: article.users?.map((user) => user.id) || [],
    };

    await this.elasticsearchService.index({
      index: this.indexName,
      id: article.id.toString(),
      document,
    });
  }

  async updateArticle(article: ArticleEntity): Promise<void> {
    await this.indexArticle(article); // Elasticsearch index operation is upsert by default
  }

  async deleteArticle(articleId: number): Promise<void> {
    await this.elasticsearchService.delete({
      index: this.indexName,
      id: articleId.toString(),
    });
  }

  async searchArticles(
    query: SearchArticlesReqDto,
    currentUser?: CurrentUser,
  ): Promise<SearchArticlesResDto> {
    const searchBody = this.buildSearchQuery(query);
    const body: { [key: string]: any } = {
      query: searchBody.query,
    };
    if (
      searchBody.sort &&
      Array.isArray(searchBody.sort) &&
      searchBody.sort.length > 0
    ) {
      body.sort = searchBody.sort;
    }
    if (searchBody.highlight) {
      body.highlight = searchBody.highlight;
    }
    if (searchBody.aggs) {
      body.aggs = searchBody.aggs;
    }
    const response = await this.elasticsearchService.search({
      index: this.indexName,
      from: query.offset,
      size: query.limit,
      body,
    });
    const hits = response.hits.hits as SearchHit<ArticleDocument>[];
    const total = (response.hits.total as SearchTotalHits).value;
    const results = hits.map((hit) => this.mapArticleResult(hit, currentUser));
    return {
      articles: results,
      articlesCount: results.length,
      searchMeta: {
        total,
        took: response.took || 0,
        maxScore: response.hits.max_score || 0,
      },
    };
  }

  private buildSearchQuery(query: SearchArticlesReqDto) {
    const must: any[] = [];
    const filter: any[] = [];

    // Text search
    if (query.q) {
      must.push({
        multi_match: {
          query: query.q,
          fields: ['title^3', 'description^2', 'body'],
          type: 'best_fields',
          fuzziness: 'AUTO',
        },
      });
    } else {
      must.push({ match_all: {} });
    }

    // Filters
    if (query.author) {
      filter.push({
        term: { 'author.username': query.author },
      });
    }

    if (query.tag) {
      filter.push({
        term: { tagList: query.tag },
      });
    }

    if (query.favorited) {
      // Note: This would require a join with user data or storing favorited info
      // For now, we'll implement a basic version
      filter.push({
        exists: { field: 'favoritedBy' },
      });
    }

    // Sort
    const sort: any[] = [];
    if (query.sortBy === 'relevance' && query.q) {
      sort.push({ _score: { order: query.sortOrder } });
    } else if (query.sortBy === 'createdAt') {
      sort.push({ createdAt: { order: query.sortOrder } });
    } else if (query.sortBy === 'updatedAt') {
      sort.push({ updatedAt: { order: query.sortOrder } });
    } else {
      sort.push({ createdAt: { order: 'desc' } });
    }

    return {
      query: {
        bool: {
          must,
          filter,
        },
      },
      sort,
      highlight: {
        fields: {
          title: {},
          description: {},
          body: { fragment_size: 150, number_of_fragments: 3 },
        },
        pre_tags: ['<em>'],
        post_tags: ['</em>'],
      },
      aggs: {
        tags: {
          terms: { field: 'tagList', size: 10 },
        },
        authors: {
          terms: { field: 'author.username', size: 10 },
        },
      },
    };
  }

  private mapArticleResult(
    hit: SearchHit<ArticleDocument>,
    currentUser?: CurrentUser,
  ): ArticleSearchResult {
    const source = hit._source as ArticleDocument;
    const highlights = hit.highlight || {};
    return {
      id: source.articleId,
      slug: source.slug,
      title: source.title,
      description: source.description,
      body: source.body,
      highlights: {
        title: highlights.title,
        description: highlights.description,
        body: highlights.body,
      },
      tagList: source.tagList,
      createdAt: new Date(source.createdAt),
      updatedAt: new Date(source.updatedAt),
      favorited: currentUser
        ? source.favoritedBy?.includes(currentUser.id) || false
        : false,
      favoritesCount: source.favoritesCount,
      author: {
        username: source.author.username,
        bio: source.author.bio,
        image: source.author.image,
        following: false, // This would need to be calculated from user relations
      },
      ...(hit._score ? { score: hit._score } : {}),
    };
  }

  async bulkIndexArticles(articles: ArticleEntity[]): Promise<void> {
    if (articles.length === 0) return;

    const body: any[] = [];

    for (const article of articles) {
      const document: ArticleDocument = {
        articleId: article.id,
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tags?.map((tag) => tag.name) || [],
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
        author: {
          id: article.author.id,
          username: article.author.username,
          bio: article.author.bio || '',
          image: article.author.image || '',
        },
        favoritesCount: article.users?.length || 0,
        favoritedBy: article.users?.map((user) => user.id) || [],
      };

      body.push(
        { index: { _index: this.indexName, _id: article.id.toString() } },
        document,
      );
    }

    await this.elasticsearchService.bulk({
      operations: body,
    });
  }

  async deleteIndex(): Promise<void> {
    await this.elasticsearchService.indices.delete({
      index: this.indexName,
    });
  }

  async reindex(articles: ArticleEntity[]): Promise<void> {
    await this.deleteIndex();
    await this.createIndex();
    await this.bulkIndexArticles(articles);
  }
}
