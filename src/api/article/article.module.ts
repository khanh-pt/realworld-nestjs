import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { TagEntity } from '../tag/entities/tag.entity';
import { FollowEntity } from '../follow/entities/follow.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CommentEntity } from '../comment/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      FollowEntity,
      TagEntity,
      UserEntity,
      CommentEntity,
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
