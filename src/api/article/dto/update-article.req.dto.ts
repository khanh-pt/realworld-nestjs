import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ArticleData {
  @ApiProperty({
    description: 'Updated title of the article',
    example: 'Updated: How to Build a NestJS Application',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Updated description of the article',
    example:
      'An updated comprehensive guide to building scalable applications with NestJS',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Updated main content of the article in markdown format',
    example: '# Updated Introduction\n\nThis updated article will teach you...',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  body?: string;
}

export class UpdateArticleReqDto {
  @ApiProperty({
    description: 'Article data to update',
    type: ArticleData,
  })
  @ValidateNested()
  @Type(() => ArticleData)
  article: ArticleData;
}
