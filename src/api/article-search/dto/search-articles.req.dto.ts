import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchArticlesReqDto {
  @ApiPropertyOptional({
    description: 'Search query for title, description, and body',
    example: 'javascript tutorial',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Filter by author username',
    example: 'john_doe',
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    description: 'Filter by tag',
    example: 'javascript',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Filter by user who favorited the article',
    example: 'jane_doe',
  })
  @IsOptional()
  @IsString()
  favorited?: string;

  @ApiPropertyOptional({
    description: 'Number of articles to return',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }: { value: any }): number =>
    typeof value === 'string' ? parseInt(value, 10) : Number(value),
  )
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Number of articles to skip',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @Transform(({ value }: { value: any }): number =>
    typeof value === 'string' ? parseInt(value, 10) : Number(value),
  )
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'createdAt',
    enum: ['relevance', 'createdAt', 'updatedAt'],
  })
  @IsOptional()
  @IsString()
  sortBy?: 'relevance' | 'createdAt' | 'updatedAt' = 'relevance';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
