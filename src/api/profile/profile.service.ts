import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { FollowEntity } from '../follow/entities/follow.entity';
import { UserEntity } from '../user/entities/user.entity';
import { FollowUserResDto } from './dto/follow-user.res.dto';
import { GetProfileResDto } from './dto/get-profile.res.dto';
import { CurrentUser } from 'src/types/request.type';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(
    username: string,
    currentUser?: CurrentUser,
  ): Promise<{ profile: GetProfileResDto }> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const following = currentUser
      ? await this.followRepository.exists({
          where: { followerId: currentUser.id, followingId: user.id },
        })
      : false;

    return {
      profile: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following,
      },
    };
  }

  async followUser(
    followerId: number,
    username: string,
  ): Promise<{ profile: FollowUserResDto }> {
    const followingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!followingUser) {
      throw new NotFoundException('User not found');
    }
    if (followerId === followingUser.id) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const isFollowing = await this.followRepository.exists({
      where: { followerId, followingId: followingUser.id },
    });

    if (!isFollowing) {
      await this.followRepository.save({
        followerId,
        followingId: followingUser.id,
      });
    }

    return {
      profile: {
        username: followingUser.username,
        bio: followingUser.bio,
        image: followingUser.image,
        following: true,
      },
    };
  }

  async unfollowUser(
    followerId: number,
    username: string,
  ): Promise<{ profile: FollowUserResDto }> {
    const followingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!followingUser) {
      throw new NotFoundException('User not found');
    }
    if (followerId === followingUser.id) {
      throw new BadRequestException('You cannot unfollow yourself');
    }

    const follow = await this.followRepository.findOne({
      where: { followerId, followingId: followingUser.id },
    });

    if (follow) {
      await this.followRepository.remove(follow);
    }

    return {
      profile: {
        username: followingUser.username,
        bio: followingUser.bio,
        image: followingUser.image,
        following: false,
      },
    };
  }
}
