import { DataSource, Repository } from 'typeorm';
import { FollowEntity } from '@/api/follow/entities/follow.entity';
import { UserEntity } from '@/api/user/entities/user.entity';

export class FollowSeeder {
  private followRepository: Repository<FollowEntity>;

  constructor(private dataSource: DataSource) {
    this.followRepository = this.dataSource.getRepository(FollowEntity);
  }

  async seed(users: UserEntity[]): Promise<FollowEntity[]> {
    // Create a realistic follow network
    const followRelationships = [
      // john_doe (index 0) follows jane_smith, alice_dev, carol_tech
      { followerIndex: 0, followingIndex: 1 },
      { followerIndex: 0, followingIndex: 2 },
      { followerIndex: 0, followingIndex: 4 },

      // jane_smith (index 1) follows john_doe, bob_wilson, carol_tech
      { followerIndex: 1, followingIndex: 0 },
      { followerIndex: 1, followingIndex: 3 },
      { followerIndex: 1, followingIndex: 4 },

      // alice_dev (index 2) follows john_doe, jane_smith, bob_wilson
      { followerIndex: 2, followingIndex: 0 },
      { followerIndex: 2, followingIndex: 1 },
      { followerIndex: 2, followingIndex: 3 },

      // bob_wilson (index 3) follows everyone except demo_user
      { followerIndex: 3, followingIndex: 0 },
      { followerIndex: 3, followingIndex: 1 },
      { followerIndex: 3, followingIndex: 2 },
      { followerIndex: 3, followingIndex: 4 },

      // carol_tech (index 4) follows john_doe, alice_dev
      { followerIndex: 4, followingIndex: 0 },
      { followerIndex: 4, followingIndex: 2 },

      // demo_user (index 5) follows john_doe, jane_smith
      { followerIndex: 5, followingIndex: 0 },
      { followerIndex: 5, followingIndex: 1 },
    ];

    const follows: FollowEntity[] = [];

    for (const relationship of followRelationships) {
      const follow = this.followRepository.create({
        followerId: users[relationship.followerIndex].id,
        followingId: users[relationship.followingIndex].id,
      });

      const savedFollow = await this.followRepository.save(follow);
      follows.push(savedFollow);
    }

    return follows;
  }
}
