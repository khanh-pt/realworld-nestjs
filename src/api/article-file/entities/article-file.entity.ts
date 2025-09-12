import { Column, Entity, Index } from 'typeorm';

export enum RoleEnum {
  THUMBNAIL = 'thumbnail',
  IMAGES = 'images',
  VIDEOS = 'videos',
}

@Entity('article_files')
@Index('UQ_article_file', ['articleId', 'fileId'], { unique: true })
export class ArticleFileEntity {
  @Column({ primary: true, primaryKeyConstraintName: 'PK_article_file' })
  id: number;

  @Column({ name: 'article_id' })
  @Index('IDX_article_file_article_id')
  articleId: number;

  @Column({ name: 'file_id' })
  @Index('IDX_article_file_file_id')
  fileId: number;

  @Column()
  role: RoleEnum;
}
