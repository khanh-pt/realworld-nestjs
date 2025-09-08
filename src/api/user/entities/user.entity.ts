import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hashPassword } from '../../../utils/hashing.util';
import { ArticleEntity } from '../../../api/article/entities/article.entity';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { SessionEntity } from './session.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
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

  @Column({ type: String, nullable: true })
  bio: string | null;

  @Column({ type: String, nullable: true })
  image: string | null;

  @Column({ default: false })
  demo: boolean;

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @ManyToMany(() => ArticleEntity, (article) => article.users)
  favoritedArticles: ArticleEntity[];

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];

  // Store original password after loading from database
  private originalPassword: string;

  @AfterLoad()
  storeOriginalPassword() {
    this.originalPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Only hash if password has changed or it's a new entity (no originalPassword)
    if (
      this.password &&
      (!this.originalPassword || this.password !== this.originalPassword)
    ) {
      this.password = await hashPassword(this.password);
    }
  }
}
