import { Check, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('follows')
@Index('IDX_follow_follower_following', ['followerId', 'followingId'], {
  unique: true,
})
@Check('CHK_follow_not_self', '"follower_id" != "following_id"')
export class FollowEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_follow_id' })
  id: number;

  @Column({ name: 'follower_id' })
  @Index('IDX_follow_follower_id')
  followerId: number;

  @Column({ name: 'following_id' })
  @Index('IDX_follow_following_id')
  followingId: number;
}
