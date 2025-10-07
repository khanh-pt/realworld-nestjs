import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ArticleSearchService } from './article-search.service';
import { SearchArticlesReqDto } from './dto/search-articles.req.dto';
import { SearchArticlesResDto } from './dto/search-articles.res.dto';
import { AuthOptional } from '../../decorators/auth-optional.decorator';
import { GetCurrentUser } from '../../decorators/get-current-user.decorator';
import { CurrentUser } from '../../types/request.type';

@ApiTags('Article Search')
@Controller('articles-search')
export class ArticleSearchController {
  constructor(private readonly articleSearchService: ArticleSearchService) {}

  @Get()
  @AuthOptional()
  @ApiOperation({
    summary: 'Search articles using Elasticsearch',
    description:
      'Search articles by title, description, body, author, tags, and other filters with relevance scoring',
  })
  @ApiResponse({
    status: 200,
    description: 'Articles found successfully',
    type: SearchArticlesResDto,
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query for title, description, and body',
    example: 'javascript tutorial',
  })
  @ApiQuery({
    name: 'author',
    required: false,
    description: 'Filter by author username',
    example: 'john_doe',
  })
  @ApiQuery({
    name: 'tag',
    required: false,
    description: 'Filter by tag',
    example: 'javascript',
  })
  @ApiQuery({
    name: 'favorited',
    required: false,
    description: 'Filter by user who favorited the article',
    example: 'jane_doe',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of articles to return (1-100)',
    example: 20,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Number of articles to skip',
    example: 0,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort by field',
    enum: ['relevance', 'createdAt', 'updatedAt'],
    example: 'relevance',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  async searchArticles(
    @Query(new ValidationPipe({ transform: true })) query: SearchArticlesReqDto,
    @GetCurrentUser() currentUser?: CurrentUser,
  ): Promise<SearchArticlesResDto> {
    return this.articleSearchService.searchArticles(query, currentUser);
  }
}
