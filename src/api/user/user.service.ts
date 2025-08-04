import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(dto: RegisterReqDto): Promise<{ user: RegisterResDto }> {
    const isExistUserName = await this.userRepository.exists({
      where: { username: dto.user.username },
    });

    if (isExistUserName) {
      throw new ConflictException('Username already exists');
    }

    const isExistEmail = await this.userRepository.exists({
      where: { email: dto.user.email },
    });

    if (isExistEmail) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepository.create(dto.user);
    await this.userRepository.save(user);

    return {
      user: {
        username: user.username,
        email: user.email,
        token: 'some-jwt-token',
        bio: user.bio,
        image: user.image,
      },
    };
  }
}
