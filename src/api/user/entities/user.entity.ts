import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hashPassword } from '../../../utils/hashing.util';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_user_id' })
  id: number;

  @Column()
  @Index('UQ_user_username', { unique: true })
  username: string;

  @Column()
  @Index('UQ_user_email', { unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ default: false })
  demo: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }
}
