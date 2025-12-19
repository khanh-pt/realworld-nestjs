import { registerAs } from '@nestjs/config';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import validateConfig from '@/utils/validate-config';
import { RedisConfig } from './redis-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  REDIS_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  REDIS_PORT: number;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD: string;

  @IsOptional()
  @IsString()
  REDIS_KEY_PREFIX: string;
}

export default registerAs<RedisConfig>('redis', () => {
  const validated = validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: validated.REDIS_HOST,
    port: validated.REDIS_PORT,
    password: validated.REDIS_PASSWORD,
    keyPrefix: validated.REDIS_KEY_PREFIX,
  };
});
