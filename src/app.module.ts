import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@/config/app.config';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig],
  envFilePath: ['.env'],
});

@Module({
  imports: [configModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
