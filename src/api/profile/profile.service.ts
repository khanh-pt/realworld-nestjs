import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { UserEntity } from '../user/entities/user.entity';
import { GetProfileResDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getProfile(username: string): Promise<{ profile: GetProfileResDto }> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    return {
      profile: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: false,
      },
    };
  }
}
