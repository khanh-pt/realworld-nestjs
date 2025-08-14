import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
}
