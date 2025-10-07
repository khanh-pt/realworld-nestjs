import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { UserEntity } from './user.entity';

@Entity('sessions')
export class SessionEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_session_id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  @Index('UQ_session_hash', { unique: true })
  hash: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserEntity, (user) => user.sessions, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
