import { ApiModule } from '@/api/api.module';
import jwtConfig from '@/api/jwt/config/jwt.config';
import appConfig from '@/config/app.config';
import gcsConfig from '@/config/gcs.config';
import elasticsearchConfig from '@/config/elasticsearch.config';
import databaseConfig from '@/database/config/database.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllConfigType } from './config/config.type';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig, databaseConfig, jwtConfig, gcsConfig, elasticsearchConfig],
  envFilePath: ['.env'],
});

const i18nModule = I18nModule.forRoot({
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname, '/i18n/'),
    watch: true,
  },
  resolvers: [{ use: QueryResolver, options: ['lang'] }],
  typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
});

const dbModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService<AllConfigType>) => {
    return {
      type: configService.get('database.type', { infer: true }),
      host: configService.get('database.host', { infer: true }),
      port: configService.get('database.port', { infer: true }),
      username: configService.get('database.username', { infer: true }),
      password: configService.get('database.password', { infer: true }),
      database: configService.get('database.name', { infer: true }),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: configService.get('database.synchronize', { infer: true }),
      logger: 'formatted-console',
      logging: ['error', 'warn', 'query', 'schema'],
    } as TypeOrmModuleOptions;
  },
});

@Module({
  imports: [ApiModule, configModule, i18nModule, dbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
