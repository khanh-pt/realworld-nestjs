import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { UserEntity } from '../../../api/user/entities/user.entity';
import { TagEntity } from '../../tag/entities/tag.entity';
import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
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

  @ManyToMany(() => TagEntity, (tag) => tag.articles)
  @JoinTable({
    name: 'article_tags',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[];

  @ManyToMany(() => UserEntity, (user) => user.articles)
  @JoinTable({
    name: 'article_users',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: UserEntity[] | undefined;
}
