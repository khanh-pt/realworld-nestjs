import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ArticleSearchService } from './article-search.service';
import { ArticleSearchController } from './article-search.controller';
import { ArticleEntity } from '../article/entities/article.entity';
import { TagEntity } from '../tag/entities/tag.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config/config.type';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, TagEntity, UserEntity]),
    ElasticsearchModule.registerAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        node: configService.getOrThrow('elasticsearch.node', { infer: true }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ArticleSearchController],
  providers: [ArticleSearchService],
  exports: [ArticleSearchService],
})
export class ArticleSearchModule {}
