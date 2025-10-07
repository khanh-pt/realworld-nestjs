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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AllConfigType>);
  const jwtService = app.get(JwtService);
  const userService = app.get(UserService);
  const reflector = app.get(Reflector);
  const port = configService.getOrThrow('app.port', { infer: true });

  // swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS RealWorld API')
    .setDescription(
      'A RealWorld API implementation built with NestJS, TypeORM, and JWT authentication. This API provides endpoints for user authentication, article management, comments, and user profiles.',
    )
    .setVersion('1.0')
    .addTag('Users', 'User profile management and authentication')
    .addTag('Articles', 'Article CRUD operations, favorites, and feed')
    .addTag('Profiles', 'User profile operations and following/unfollowing')
    .addTag('Tags', 'Article tag management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3333', 'Development server')
    .setContact(
      'khanhpt-2853',
      'https://github.com/khanhpt-2853/realworld-nestjs',
      'khanh.pt@example.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins for development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Global interceptors - log info request/response
  app.useGlobalInterceptors(new LoggingInterceptor());

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
