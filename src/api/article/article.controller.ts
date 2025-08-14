import { Body, Controller, Post, Request } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthenticatedRequest } from 'src/types/request.type';
import { CreateArticleReqDto } from './dto/create-article.req.dto';
import { CreateArticleResDto } from './dto/create-article.res.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async createArticle(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateArticleReqDto,
  ): Promise<{ article: CreateArticleResDto }> {
    return await this.articleService.createArticle(req.currentUser, dto);
  }
}
