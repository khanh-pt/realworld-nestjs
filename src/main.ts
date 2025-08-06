import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { AuthGuard } from './guards/auth.guard';
import { UserService } from '@/api/user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AllConfigType>);
  const jwtService = app.get(JwtService);
  const userService = app.get(UserService);
  const reflector = app.get(Reflector);
  const port = configService.getOrThrow('app.port', { infer: true });

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  app.useGlobalGuards(
    new AuthGuard(configService, jwtService, userService, reflector),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(port);
}
void bootstrap();
