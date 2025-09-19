import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [UserModule, ProfileModule, ArticleModule, TagModule, FileModule],
})
export class ApiModule {}
