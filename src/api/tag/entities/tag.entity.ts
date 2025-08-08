import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tags')
export class TagEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_tag_id' })
  id: number;

  @Column()
  @Index('UQ_tag_name', { unique: true })
  name: string;
}
