import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

class ArticleData {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  body?: string;
}

export class UpdateArticleReqDto {
  @ValidateNested()
  @Type(() => ArticleData)
  article: ArticleData;
}
