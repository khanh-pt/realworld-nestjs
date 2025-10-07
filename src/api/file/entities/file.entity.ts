import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

interface FileMetadata {
  identified?: boolean;
  width?: number;
  height?: number;
  duration?: number;
  analyzed?: boolean;
}

@Entity('files')
export class FileEntity extends BaseEntity {
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
  checksum: string;
}
