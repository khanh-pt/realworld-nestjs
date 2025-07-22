import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@/config/app.config';
import { I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig],
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

@Module({
  imports: [configModule, i18nModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
