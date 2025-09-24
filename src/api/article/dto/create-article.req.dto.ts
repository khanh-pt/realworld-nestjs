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

  // Allow add thumbnail
  @ApiProperty({
    description: 'ID of the thumbnail file associated with the article',
    example: 1,
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  fileId?: number;

  @ApiProperty({
    description: 'Key of the thumbnail file associated with the article',
    example: 'uploads/unique-file-key.jpg',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  key?: string;

  @ApiProperty({
    description: 'Role of the file associated with the article',
    example: 'thumbnail | image | video',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: string;
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
