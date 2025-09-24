import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { ArticleFileEntity } from '@/api/article-file/entities/article-file.entity';

interface FileMetadata {
  identified?: boolean;
  width?: number;
  height?: number;
  duration?: number;
  analyzed?: boolean;
}

@Entity('files')
export class FileEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_file_id' })
  id: number;

  @Column()
  @Index('UQ_file_key', { unique: true })
  key: string;

  @Column()
  filename: string;

  @Column({ name: 'content_type' })
  contentType: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: FileMetadata | null;

  @Column({ name: 'service_name' })
  serviceName: string;

  @Column({ name: 'byte_size' })
  byteSize: number;

  @Column()
  @Index('IDX_file_checksum')
  checksum: string;

  // Relations
  articleFiles: ArticleFileEntity[];
}
