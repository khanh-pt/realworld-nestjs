import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import validateConfig from '@/utils/validate-config';
import { DatabaseConfig } from './database-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  DATABASE_TYPE: string;

  @IsString()
  DATABASE_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsOptional()
  @IsBoolean()
  DATABASE_SYNCHRONIZE: boolean;

  @IsOptional()
  @IsBoolean()
  DATABASE_LOGGING: boolean;
}

export default registerAs<DatabaseConfig>('database', () => {
  const validated = validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    type: validated.DATABASE_TYPE,
    host: validated.DATABASE_HOST,
    port: validated.DATABASE_PORT,
    username: validated.DATABASE_USERNAME,
    password: validated.DATABASE_PASSWORD,
    name: validated.DATABASE_NAME,
    synchronize: validated.DATABASE_SYNCHRONIZE === true, // Default to false in production
    logging: validated.DATABASE_LOGGING === true, // Default to false in production
  };
});
