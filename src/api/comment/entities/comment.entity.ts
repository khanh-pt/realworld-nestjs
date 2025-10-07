import { ArticleEntity } from '../../../api/article/entities/article.entity';
import { UserEntity } from '../../../api/user/entities/user.entity';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comments')
export class CommentEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_comment_id' })
  id: number;

  @Column({ type: 'text' })
  body: string;

  @ManyToOne(() => ArticleEntity)
  @JoinColumn({ name: 'article_id' })
  @Index('IDX_comment_article_id')
  article: ArticleEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  @Index('IDX_comment_author_id')
  author: UserEntity;
}
