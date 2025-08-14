import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class ArticleData {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagList?: string[] = [];
}

export class CreateArticleReqDto {
  @ValidateNested()
  @Type(() => ArticleData)
  article: ArticleData;
}
