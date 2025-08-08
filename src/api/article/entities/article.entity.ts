import { UserEntity } from '../../../api/user/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_article_id' })
  id: number;

  @Column()
  @Index('UQ_article_slug', { unique: true })
  slug: string;

  @Column()
  @Index('UQ_article_title', { unique: true })
  title: string;

  @Column()
  body: string;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.articles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'author_id',
    foreignKeyConstraintName: 'FK_article_author_id',
  })
  author: UserEntity;
}
