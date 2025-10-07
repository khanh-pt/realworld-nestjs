import { ApiProperty } from '@nestjs/swagger';

export class ArticleSearchResult {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'how-to-train-your-dragon' })
  slug: string;

  @ApiProperty({ example: 'How to train your dragon' })
  title: string;

  @ApiProperty({ example: 'Ever wonder how?' })
  description: string;

  @ApiProperty({ example: 'It takes a Jacobian' })
  body: string;

  @ApiProperty({
    example: {
      title: ['How to <em>train</em> your dragon'],
      description: ['Ever wonder <em>how</em>?'],
      body: ['It takes a <em>Jacobian</em>'],
    },
  })
  highlights?: {
    title?: string[];
    description?: string[];
    body?: string[];
  };

  @ApiProperty({ example: ['dragons', 'training'] })
  tagList: string[];

  @ApiProperty({ example: '2016-02-18T03:22:56.637Z' })
  createdAt: Date;

  @ApiProperty({ example: '2016-02-18T03:48:35.824Z' })
  updatedAt: Date;

  @ApiProperty({ example: false })
  favorited: boolean;

  @ApiProperty({ example: 0 })
  favoritesCount: number;

  @ApiProperty({
    example: {
      username: 'jake',
      bio: 'I work at statefarm',
      image: 'https://i.stack.imgur.com/xHWG8.jpg',
      following: false,
    },
  })
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };

  @ApiProperty({ example: 0.95, description: 'Search relevance score' })
  score?: number;
}

export class SearchArticlesResDto {
  @ApiProperty({ type: [ArticleSearchResult] })
  articles: ArticleSearchResult[];

  @ApiProperty({ example: 1 })
  articlesCount: number;

  @ApiProperty({
    example: {
      total: 100,
      took: 15,
      maxScore: 0.95,
    },
  })
  searchMeta: {
    total: number;
    took: number;
    maxScore: number;
  };

  @ApiProperty({
    example: {
      tags: [
        { key: 'javascript', doc_count: 25 },
        { key: 'tutorial', doc_count: 18 },
      ],
      authors: [
        { key: 'john_doe', doc_count: 5 },
        { key: 'jane_doe', doc_count: 3 },
      ],
    },
  })
  aggregations?: {
    tags?: Array<{ key: string; doc_count: number }>;
    authors?: Array<{ key: string; doc_count: number }>;
  };
}
