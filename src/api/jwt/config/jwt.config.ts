import validateConfig from '@/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { JwtConfig } from './jwt-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_REFRESH_EXPIRES_IN: string;
}

export default registerAs<JwtConfig>('jwt', () => {
  const validated = validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: validated.JWT_SECRET,
    expiresIn: validated.JWT_EXPIRES_IN,
    refreshSecret: validated.JWT_SECRET,
    refreshExpiresIn: validated.JWT_REFRESH_EXPIRES_IN,
  };
});
