import { registerAs } from '@nestjs/config';
import validateConfig from '@/utils/validate-config';
import { IsString, IsInt, Min } from 'class-validator';
import { GcsConfig } from './gcs-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  GCS_PROJECT_ID: string;

  @IsString()
  GCS_CLIENT_EMAIL: string;

  @IsString()
  GCS_PRIVATE_KEY: string;

  @IsString()
  GCS_BUCKET_NAME: string;

  @IsInt()
  @Min(300) // minimum 5 minutes
  GCS_SIGNED_URL_EXPIRES: number;
}

export default registerAs<GcsConfig>('gcs', () => {
  const validated = validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    projectId: validated.GCS_PROJECT_ID,
    clientEmail: validated.GCS_CLIENT_EMAIL,
    privateKey: validated.GCS_PRIVATE_KEY,
    bucketName: validated.GCS_BUCKET_NAME,
    signedUrlExpires: validated.GCS_SIGNED_URL_EXPIRES,
  };
});
