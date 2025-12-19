import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileEntity } from './entities/file.entity';
import gcsConfig from '@/config/gcs.config';
import { RedisModule } from '@/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    ConfigModule.forFeature(gcsConfig),
    RedisModule,
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
