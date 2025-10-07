import { registerAs } from '@nestjs/config';
import { ElasticsearchConfig } from './elasticsearch-config.type';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import validateConfig from '@/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  ELASTICSEARCH_NODE: string;

  @IsOptional()
  @IsString()
  ELASTICSEARCH_USERNAME: string;

  @IsOptional()
  @IsString()
  ELASTICSEARCH_PASSWORD: string;

  @IsOptional()
  @IsString()
  ELASTICSEARCH_API_KEY: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  ELASTICSEARCH_MAX_RETRIES: number;

  @IsOptional()
  @IsNumber()
  @Min(1000)
  ELASTICSEARCH_REQUEST_TIMEOUT: number;

  @IsOptional()
  @IsNumber()
  @Min(1000)
  ELASTICSEARCH_PING_TIMEOUT: number;

  @IsOptional()
  @IsString()
  ELASTICSEARCH_ARTICLE_INDEX: string;

  @IsOptional()
  @IsString()
  ELASTICSEARCH_USER_INDEX: string;
}

export default registerAs<ElasticsearchConfig>('elasticsearch', () => {
  const validated = validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    node: validated.ELASTICSEARCH_NODE,
    username: validated.ELASTICSEARCH_USERNAME || '',
    password: validated.ELASTICSEARCH_PASSWORD || '',
    apiKey: validated.ELASTICSEARCH_API_KEY || '',
    maxRetries: validated.ELASTICSEARCH_MAX_RETRIES || 3,
    requestTimeout: validated.ELASTICSEARCH_REQUEST_TIMEOUT || 30000,
    pingTimeout: validated.ELASTICSEARCH_PING_TIMEOUT || 3000,
    articleIndex: validated.ELASTICSEARCH_ARTICLE_INDEX || 'nestjs_articles',
  };
});
