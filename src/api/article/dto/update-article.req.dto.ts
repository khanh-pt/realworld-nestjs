import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
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

export class UpdateArticleReqDto {
  @ApiProperty({
    description: 'Article data to update',
    type: ArticleData,
  })
  @ValidateNested()
  @Type(() => ArticleData)
  article: ArticleData;
}
