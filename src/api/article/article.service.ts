import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './entities/article.entity';
import { GetAllArticlesReqDto } from './dto/get-all-articles.req.dto';
import { GetAllArticlesResDto } from './dto/get-all-articles.res.dto';
import { CurrentUser } from 'src/types/request.type';
import { CreateArticleReqDto } from './dto/create-article.req.dto';
import { CreateArticleResDto } from './dto/create-article.res.dto';
import { TagEntity } from '../tag/entities/tag.entity';
import { FollowEntity } from '../follow/entities/follow.entity';
import slug from 'slug';
import { GetArticleResDto } from './dto/get-article.res.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UpdateArticleReqDto } from './dto/update-article.req.dto';
import { CreateCommentReqDto } from '../comment/dto/create-comment.req.dto';
import { CreateCommentResDto } from '../comment/dto/create-comment.res.dto';
import { CommentEntity } from '../comment/entities/comment.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async findAll(
    query: GetAllArticlesReqDto,
    currentUser?: CurrentUser,
  ): Promise<GetAllArticlesResDto> {
    const { tag, author, favorited, limit = 20, offset = 0 } = query;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoinAndSelect('article.users', 'users')
      .orderBy('article.createdAt', 'DESC')
      .addOrderBy('tags.id', 'DESC');

    // Filter by tag
    if (tag) {
      queryBuilder
        .innerJoin('article.tags', 'filterTag')
        .andWhere('filterTag.name = :tag', { tag });
    }

    // Filter by author username
    if (author) {
      queryBuilder.andWhere('author.username = :author', { author });
    }

    // Filter by favorited by user
    if (favorited) {
      queryBuilder
        .innerJoin('article.users', 'favoritedUser')
        .andWhere('favoritedUser.username = :favorited', { favorited });
    }

    // Apply pagination
    queryBuilder.skip(offset).take(limit);

    const [articles, total] = await queryBuilder.getManyAndCount();

    return {
      articles: await Promise.all(
        articles.map(
          async (article) =>
            await this.mapToArticleResponse(article, currentUser),
        ),
      ),
      articlesCount: total,
    };
  }

  async createArticle(
    currentUser: CurrentUser,
    dto: CreateArticleReqDto,
  ): Promise<{ article: CreateArticleResDto }> {
    const article = this.articleRepository.create({
      ...dto.article,
      slug: this.generateSlug(dto.article.title),
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
      relations: ['author', 'tags', 'users'],
      order: {
        tags: {
          id: 'DESC',
        },
      },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    return { article: await this.mapToArticleResponse(article, currentUser) };
  }

  async favoriteArticle(
    slug: string,
    currentUser: CurrentUser,
  ): Promise<{ article: GetArticleResDto }> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'tags', 'users'],
      order: {
        tags: {
          id: 'DESC',
        },
      },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    const foundUser = await this.userRepository.findOneOrFail({
      where: { id: currentUser.id },
    });

    const favorited = article.users?.find((user) => user.id === foundUser.id);

    if (!favorited) {
      article.users?.push(foundUser);
      await this.articleRepository.save(article);
    }

    return { article: await this.mapToArticleResponse(article, currentUser) };
  }

  async unfavoriteArticle(
    slug: string,
    currentUser: CurrentUser,
  ): Promise<{ article: GetArticleResDto }> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'tags', 'users'],
      order: {
        tags: {
          id: 'DESC',
        },
      },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    const foundUser = await this.userRepository.findOneOrFail({
      where: { id: currentUser.id },
    });

    const favorited = article.users?.find((user) => user.id === foundUser.id);

    if (favorited) {
      article.users = article.users?.filter((user) => user.id !== foundUser.id);
      await this.articleRepository.save(article);
    }

    return { article: await this.mapToArticleResponse(article, currentUser) };
  }

  async deleteArticle(slug: string, currentUser: CurrentUser): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { slug, author: { id: currentUser.id } },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    await this.articleRepository.remove(article);
  }

  async updateArticle(
    currentUser: CurrentUser,
    slug: string,
    dto: UpdateArticleReqDto,
  ): Promise<{ article: GetArticleResDto }> {
    const article = await this.articleRepository.findOne({
      where: { slug, author: { id: currentUser.id } },
      relations: ['author', 'tags', 'users'],
      order: {
        tags: {
          id: 'DESC',
        },
      },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    const originalTitle = article.title;

    this.articleRepository.merge(article, dto.article);

    if (dto.article.title && dto.article.title !== originalTitle) {
      article.slug = this.generateSlug(dto.article.title);
    }

    const updatedArticle = await this.articleRepository.save(article);

    return {
      article: await this.mapToArticleResponse(updatedArticle, currentUser),
    };
  }

  async addComment(
    currentUser: CurrentUser,
    slug: string,
    dto: CreateCommentReqDto,
  ): Promise<{ comment: CreateCommentResDto }> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    });

    if (!article) {
      throw new Error('Article not found');
    }

    const userEntity = await this.userRepository.findOneOrFail({
      where: { id: currentUser.id },
    });

    const comment = new CommentEntity();
    comment.body = dto.comment.body;
    comment.author = userEntity;
    comment.article = article;

    await this.commentRepository.save(comment);

    return { comment: await this.mapToCommentResponse(comment) };
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

    const favorited =
      currentUser && article.users
        ? article.users.some((user) => user.id === currentUser.id)
        : false;

    const favoritesCount = article.users?.length || 0;

    return {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tags.map((tag) => tag.name),
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      favorited,
      favoritesCount,
      author: {
        username: article.author.username,
        bio: article.author.bio,
        image: article.author.image,
        following,
      },
    };
  }

  private async mapToCommentResponse(
    comment: CommentEntity,
    currentUser?: CurrentUser,
  ): Promise<CreateCommentResDto> {
    const following = currentUser
      ? await this.followRepository.exists({
          where: { followerId: currentUser.id, followingId: comment.author.id },
        })
      : false;

    return {
      id: comment.id,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      body: comment.body,
      author: {
        username: comment.author.username,
        bio: comment.author.bio,
        image: comment.author.image,
        following,
      },
    };
  }

  private generateSlug(title: string): string {
    return (
      slug(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
