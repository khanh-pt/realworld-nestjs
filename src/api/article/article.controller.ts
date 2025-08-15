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

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @AuthOptional()
  @Get()
  async findAll(
    @Query() query: GetAllArticlesReqDto,
    @GetCurrentUser() currentUser?: CurrentUser,
  ): Promise<GetAllArticlesResDto> {
    return this.articleService.findAll(query, currentUser);
  }

  @Get('/feed')
  async feedArticle(
    @Query() query: GetAllArticlesReqDto,
    @GetCurrentUser() currentUser?: CurrentUser,
  ): Promise<GetAllArticlesResDto> {
    return this.articleService.findAll(query, currentUser);
  }

  @Post()
  async createArticle(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateArticleReqDto,
  ): Promise<{ article: CreateArticleResDto }> {
    return await this.articleService.createArticle(req.currentUser, dto);
  }

  @AuthOptional()
  @Get(':slug')
  async getArticle(
    @Param('slug') slug: string,
    @GetCurrentUser() currentUser?: CurrentUser,
  ): Promise<{ article: GetArticleResDto }> {
    return this.articleService.getArticle(slug, currentUser);
  }

  @Post(':slug/favorite')
  async favoriteArticle(
    @Param('slug') slug: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<{ article: GetArticleResDto }> {
    return this.articleService.favoriteArticle(slug, req.currentUser);
  }

  @Delete(':slug/favorite')
  async unfavoriteArticle(
    @Param('slug') slug: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<{ article: GetArticleResDto }> {
    return this.articleService.unfavoriteArticle(slug, req.currentUser);
  }

  @Delete(':slug')
  @HttpCode(204)
  async deleteArticle(
    @Param('slug') slug: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    await this.articleService.deleteArticle(slug, req.currentUser);
  }

  @Put(':slug')
  async updateArticle(
    @Request() req: AuthenticatedRequest,
    @Param('slug') slug: string,
    @Body() dto: UpdateArticleReqDto,
  ): Promise<{ article: GetArticleResDto }> {
    return this.articleService.updateArticle(req.currentUser, slug, dto);
  }

  @Post(':slug/comments')
  async addComment(
    @Request() req: AuthenticatedRequest,
    @Param('slug') slug: string,
    @Body() dto: CreateCommentReqDto,
  ): Promise<{ comment: CreateCommentResDto }> {
    return this.articleService.addComment(req.currentUser, slug, dto);
  }

  @AuthOptional()
  @Get(':slug/comments')
  async getComments(
    @Param('slug') slug: string,
    @GetCurrentUser() currentUser?: CurrentUser,
  ): Promise<{ comments: CreateCommentResDto[] }> {
    return this.articleService.getComments(slug, currentUser);
  }
}
