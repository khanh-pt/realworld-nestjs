import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAllArticlesReqDto {
  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  favorited?: string;

  @IsOptional()
  @Transform(({ value }: { value: any }): number =>
    typeof value === 'string' ? parseInt(value, 10) : Number(value),
  )
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @Transform(({ value }: { value: any }): number =>
    typeof value === 'string' ? parseInt(value, 10) : Number(value),
  )
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
