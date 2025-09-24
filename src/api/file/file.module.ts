import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileEntity } from './entities/file.entity';
import gcsConfig from '@/config/gcs.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    ConfigModule.forFeature(gcsConfig),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
