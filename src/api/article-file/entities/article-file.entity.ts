import { FileEntity } from '@/api/file/entities/file.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

export enum RoleEnum {
  THUMBNAILS = 'thumbnails',
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

  @ManyToOne(() => FileEntity, (file) => file.articleFiles)
  @JoinColumn({ name: 'file_id' })
  file: FileEntity;
}
