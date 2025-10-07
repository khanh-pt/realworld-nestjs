import { JwtConfig } from '@/api/jwt/config/jwt-config.type';
import { DatabaseConfig } from '@/database/config/database-config.type';
import { AppConfig } from './app-config.type';
import { GcsConfig } from './gcs-config.type';
import { ElasticsearchConfig } from './elasticsearch-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
  gcs: GcsConfig;
  elasticsearch: ElasticsearchConfig;
};
