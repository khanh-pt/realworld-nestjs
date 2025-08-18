import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { AuthenticatedRequest, CurrentUser } from 'src/types/request.type';
import { CreateArticleReqDto } from './dto/create-article.req.dto';
import { CreateArticleResDto } from './dto/create-article.res.dto';
import { AuthOptional } from 'src/decorators/auth-optional.decorator';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { GetArticleResDto } from './dto/get-article.res.dto';
import { GetAllArticlesReqDto } from './dto/get-all-articles.req.dto';
import { GetAllArticlesResDto } from './dto/get-all-articles.res.dto';
import { UpdateArticleReqDto } from './dto/update-article.req.dto';
import { CreateCommentReqDto } from '../comment/dto/create-comment.req.dto';
import { CreateCommentResDto } from '../comment/dto/create-comment.res.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @AuthOptional()
  @Get()
  @ApiOperation({
    summary: 'Get all articles',
    description:
      'Get multiple articles with optional filtering by author, tag, or favorited by user',
  })
  @ApiQuery({ name: 'tag', required: false, description: 'Filter by tag' })
  @ApiQuery({
    name: 'author',
    required: false,
    description: 'Filter by author username',
  })
  @ApiQuery({
    name: 'favorited',
    required: false,
    description: 'Filter by user who favorited',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of articles to return (default 20)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Number of articles to skip (default 0)',
  })
  @ApiOkResponse({
    description: 'List of articles',
    schema: {
      example: {
        articles: [
          {
            slug: 'how-to-build-nestjs-app',
            title: 'How to Build a NestJS Application',
            description: 'A comprehensive guide...',
            body: '# Introduction...',
            tagList: ['nestjs', 'backend'],
            createdAt: '2025-01-15T10:00:00.000Z',
            updatedAt: '2025-01-15T10:00:00.000Z',
            favorited: false,
            favoritesCount: 5,
            author: {
              username: 'johndoe',
              bio: 'Software developer',
              image: 'https://example.com/profile.jpg',
              following: false,
            },
          },
        ],
        articlesCount: 1,
      },
    },
  })
  async findAll(
    @Query() query: GetAllArticlesReqDto,
    @GetCurrentUser() currentUser?: CurrentUser,
  ): Promise<GetAllArticlesResDto> {
    return this.articleService.findAll(query, currentUser);
  }

  @Get('/feed')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get article feed',
    description: 'Get articles from users that the current user follows',
  })
  @ApiOkResponse({ description: 'Feed of articles from followed users' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async feedArticle(
    @Query() query: GetAllArticlesReqDto,
    @GetCurrentUser() currentUser?: CurrentUser,
  ): Promise<GetAllArticlesResDto> {
    return this.articleService.findAll(query, currentUser);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create article',
    description: 'Create a new article',
  })
  @ApiCreatedResponse({
    description: 'Article successfully created',
    schema: {
      example: {
        article: {
          slug: 'how-to-build-nestjs-app',
          title: 'How to Build a NestJS Application',
          description: 'A comprehensive guide...',
          body: '# Introduction...',
          tagList: ['nestjs', 'backend'],
          createdAt: '2025-01-15T10:00:00.000Z',
          updatedAt: '2025-01-15T10:00:00.000Z',
          favorited: false,
          favoritesCount: 0,
          author: {
            username: 'johndoe',
            bio: 'Software developer',
            image: 'https://example.com/profile.jpg',
            following: false,
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async createArticle(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateArticleReqDto,
  ): Promise<{ article: CreateArticleResDto }> {
    return await this.articleService.createArticle(req.currentUser, dto);
  }

  @AuthOptional()
  @Get(':slug')
  @ApiOperation({
    summary: 'Get article by slug',
    description: 'Get a single article by its slug',
  })
  @ApiParam({ name: 'slug', description: 'Article slug' })
  @ApiOkResponse({
    description: 'Article details',
    schema: {
      example: {
        article: {
          slug: 'how-to-build-nestjs-app',
          title: 'How to Build a NestJS Application',
          description: 'A comprehensive guide...',
          body: '# Introduction...',
          tagList: ['nestjs', 'backend'],
          createdAt: '2025-01-15T10:00:00.000Z',
          updatedAt: '2025-01-15T10:00:00.000Z',
          favorited: false,
          favoritesCount: 5,
          author: {
            username: 'johndoe',
            bio: 'Software developer',
            image: 'https://example.com/profile.jpg',
            following: false,
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Article not found' })
  async getArticle(
    @Param('slug') slug: string,
    @GetCurrentUser() currentUser?: CurrentUser,
  ): Promise<{ article: GetArticleResDto }> {
    return this.articleService.getArticle(slug, currentUser);
  }

  @Post(':slug/favorite')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Favorite article',
    description: 'Mark article as favorited by current user',
  })
  @ApiParam({ name: 'slug', description: 'Article slug' })
  @ApiOkResponse({ description: 'Article favorited successfully' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiNotFoundResponse({ description: 'Article not found' })
  async favoriteArticle(
    @Param('slug') slug: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<{ article: GetArticleResDto }> {
    return this.articleService.favoriteArticle(slug, req.currentUser);
  }

  @Delete(':slug/favorite')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Unfavorite article',
    description: 'Remove article from favorites for current user',
  })
  @ApiParam({ name: 'slug', description: 'Article slug' })
  @ApiOkResponse({ description: 'Article unfavorited successfully' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiNotFoundResponse({ description: 'Article not found' })
  async unfavoriteArticle(
    @Param('slug') slug: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<{ article: GetArticleResDto }> {
    return this.articleService.unfavoriteArticle(slug, req.currentUser);
  }

  @Delete(':slug')
  @HttpCode(204)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete article',
    description: 'Delete an article (only by the author)',
  })
  @ApiParam({ name: 'slug', description: 'Article slug' })
  @ApiNoContentResponse({ description: 'Article deleted successfully' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Only article author can delete',
  })
  @ApiNotFoundResponse({ description: 'Article not found' })
  async deleteArticle(
    @Param('slug') slug: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    await this.articleService.deleteArticle(slug, req.currentUser);
  }

  @Put(':slug')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update article',
    description: 'Update an article (only by the author)',
  })
  @ApiParam({ name: 'slug', description: 'Article slug' })
  @ApiOkResponse({ description: 'Article updated successfully' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Only article author can update',
  })
  @ApiNotFoundResponse({ description: 'Article not found' })
  async updateArticle(
    @Request() req: AuthenticatedRequest,
    @Param('slug') slug: string,
    @Body() dto: UpdateArticleReqDto,
  ): Promise<{ article: GetArticleResDto }> {
    return this.articleService.updateArticle(req.currentUser, slug, dto);
  }

  @Post(':slug/comments')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Add comment to article',
    description: 'Add a comment to an article',
  })
  @ApiParam({ name: 'slug', description: 'Article slug' })
  @ApiCreatedResponse({
    description: 'Comment added successfully',
    schema: {
      example: {
        comment: {
          id: 1,
          body: 'Great article! Thanks for sharing.',
          createdAt: '2025-01-15T10:00:00.000Z',
          updatedAt: '2025-01-15T10:00:00.000Z',
          author: {
            username: 'johndoe',
            bio: 'Software developer',
            image: 'https://example.com/profile.jpg',
            following: false,
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiNotFoundResponse({ description: 'Article not found' })
  async addComment(
    @Request() req: AuthenticatedRequest,
    @Param('slug') slug: string,
    @Body() dto: CreateCommentReqDto,
  ): Promise<{ comment: CreateCommentResDto }> {
    return this.articleService.addComment(req.currentUser, slug, dto);
  }

  @AuthOptional()
  @Get(':slug/comments')
  @ApiOperation({
    summary: 'Get article comments',
    description: 'Get all comments for an article',
  })
  @ApiParam({ name: 'slug', description: 'Article slug' })
  @ApiOkResponse({
    description: 'List of comments',
    schema: {
      example: {
        comments: [
          {
            id: 1,
            body: 'Great article! Thanks for sharing.',
            createdAt: '2025-01-15T10:00:00.000Z',
            updatedAt: '2025-01-15T10:00:00.000Z',
            author: {
              username: 'johndoe',
              bio: 'Software developer',
              image: 'https://example.com/profile.jpg',
              following: false,
            },
          },
        ],
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Article not found' })
  async getComments(
    @Param('slug') slug: string,
    @GetCurrentUser() currentUser?: CurrentUser,
  ): Promise<{ comments: CreateCommentResDto[] }> {
    return this.articleService.getComments(slug, currentUser);
  }

  @Delete(':slug/comments/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete comment',
    description: 'Delete a comment (only by the comment author)',
  })
  @ApiParam({ name: 'slug', description: 'Article slug' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiNoContentResponse({ description: 'Comment deleted successfully' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Only comment author can delete',
  })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  async deleteComment(
    @Request() req: AuthenticatedRequest,
    @Param('slug') slug: string,
    @Param('id') id: number,
  ): Promise<void> {
    await this.articleService.deleteComment({
      currentUser: req.currentUser,
      slug,
      id,
    });
  }
}
