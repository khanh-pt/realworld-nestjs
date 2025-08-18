import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ArticleData {
  @ApiProperty({
    description: 'Title of the article',
    example: 'How to Build a NestJS Application',
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Short description of the article',
    example:
      'A comprehensive guide to building scalable applications with NestJS',
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Main content of the article in markdown format',
    example:
      '# Introduction\n\nThis article will teach you how to build amazing applications...',
    type: String,
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: 'List of tags associated with the article',
    example: ['nestjs', 'backend', 'nodejs', 'typescript'],
    type: [String],
    required: false,
    default: [],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagList?: string[] = [];
}

export class CreateArticleReqDto {
  @ApiProperty({
    description: 'Article data to create',
    type: ArticleData,
  })
  @ValidateNested()
  @Type(() => ArticleData)
  article: ArticleData;
}
