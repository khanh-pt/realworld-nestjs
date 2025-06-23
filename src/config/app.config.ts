import { registerAs } from '@nestjs/config';
import { Environment } from '@/constants/app.constant';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import validateConfig from '@/utils/validate-config';
import { AppConfig } from './app-config.type';

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;
}

export default registerAs<AppConfig>('app', () => {
  const validated = validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: validated.NODE_ENV || Environment.development,
    port: validated.PORT || 3333,
  };
});
