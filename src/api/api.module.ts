import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [UserModule, ProfileModule, ArticleModule, TagModule],
})
export class ApiModule {}
