import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AllConfigType>);
  const port = configService.getOrThrow('app.port', { infer: true });

  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(port);
}
void bootstrap();
