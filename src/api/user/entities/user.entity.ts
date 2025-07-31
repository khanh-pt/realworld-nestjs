import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

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
}
