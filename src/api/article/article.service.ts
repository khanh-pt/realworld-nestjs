import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './entities/article.entity';
import { CurrentUser } from 'src/types/request.type';
import { CreateArticleReqDto } from './dto/create-article.req.dto';
import { CreateArticleResDto } from './dto/create-article.res.dto';
import { TagEntity } from '../tag/entities/tag.entity';
import { FollowEntity } from '../follow/entities/follow.entity';
import slug from 'slug';
import { GetArticleResDto } from './dto/get-article.res.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async createArticle(
    currentUser: CurrentUser,
    dto: CreateArticleReqDto,
  ): Promise<{ article: CreateArticleResDto }> {
    const article = this.articleRepository.create({
      ...dto.article,
      slug:
        slug(dto.article.title, { lower: true }) +
        '-' +
        ((Math.random() * Math.pow(36, 6)) | 0).toString(36),
      author: currentUser,
    });
    const savedArticle = await this.articleRepository.save(article);

    if (savedArticle) {
      // create tag by tagList if needed
      if (dto.article.tagList && dto.article.tagList.length > 0) {
        // Create tags and associate with article
        const tags = await Promise.all(
          dto.article.tagList.map(async (name) => {
            const isTagExist = await this.tagRepository.findOne({
              where: { name },
            });
            if (isTagExist) {
              return isTagExist;
            }
            const tag = this.tagRepository.create({ name });
            return this.tagRepository.save(tag);
          }),
        );
        article.tags = tags;
        // Save the article again to persist the tags relationship
        await this.articleRepository.save(article);
      }
    }

    return {
      article: await this.mapToArticleResponse(savedArticle, currentUser),
    };
  }

  async getArticle(
    slug: string,
    currentUser?: CurrentUser,
  ): Promise<{ article: GetArticleResDto }> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'tags'],
    });

    if (!article) {
      throw new Error('Article not found');
    }

    return { article: await this.mapToArticleResponse(article, currentUser) };
  }

  private async mapToArticleResponse(
    article: ArticleEntity,
    currentUser?: CurrentUser,
  ): Promise<CreateArticleResDto> {
    const following = currentUser
      ? await this.followRepository.exists({
          where: { followerId: currentUser.id, followingId: article.author.id },
        })
      : false;

    return {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tags.map((tag) => tag.name),
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      favorited: false, // TODO: Check if current user favorited this article
      favoritesCount: 0, // TODO: Count favorites from favorites table
      author: {
        username: article.author.username,
        bio: article.author.bio,
        image: article.author.image,
        following,
      },
    };
  }
}
