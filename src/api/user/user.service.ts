import { AllConfigType } from '@/config/config.type';
import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
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
        token: await this.generateAccessToken({ user_id: user.id }),
        bio: user.bio,
        image: user.image,
      },
    };
  }

  async login(dto: LoginReqDto): Promise<{ user: LoginResDto }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.user.email, password: dto.user.password },
    });

    if (!user) {
      throw new ConflictException('Invalid email or password');
    }

    return {
      user: {
        username: user.username,
        email: user.email,
        token: await this.generateAccessToken({ user_id: user.id }),
        bio: user.bio,
        image: user.image,
      },
    };
  }

  private async generateAccessToken(data: {
    user_id: number;
  }): Promise<string> {
    return await this.jwtService.signAsync(
      { user_id: data.user_id },
      {
        secret: this.configService.getOrThrow('jwt.secret', { infer: true }),
        expiresIn: this.configService.getOrThrow('jwt.expiresIn', {
          infer: true,
        }),
      },
    );
  }
}
