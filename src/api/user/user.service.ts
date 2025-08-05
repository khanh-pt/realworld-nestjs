import { AllConfigType } from '@/config/config.type';
import { verifyPassword } from '@/utils/hashing.util';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { JwtPayload } from '../jwt/types/jwt-payload.type';
import { UserPayload } from '../jwt/types/user-payload.type';
import { GetUserResDto } from './dto/get-user.res.dto';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { UpdateUserReqDto } from './dto/update-user.req.dto';
import { UpdateUserResDto } from './dto/update-user.res.dto';
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
        token: await this.generateAccessToken({ id: user.id }),
        bio: user.bio,
        image: user.image,
      },
    };
  }

  async login(dto: LoginReqDto): Promise<{ user: LoginResDto }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.user.email },
    });

    if (!user || !(await verifyPassword(user.password, dto.user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      user: {
        username: user.username,
        email: user.email,
        token: await this.generateAccessToken({ id: user.id }),
        bio: user.bio,
        image: user.image,
      },
    };
  }

  async getUser(
    user: UserPayload & JwtPayload,
  ): Promise<{ user: GetUserResDto }> {
    const foundUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!foundUser) {
      throw new UnauthorizedException(`User id: ${user.id} not found`);
    }

    return {
      user: {
        username: foundUser.username,
        email: foundUser.email,
        token: await this.generateAccessToken({ id: user.id }),
        bio: foundUser.bio,
        image: foundUser.image,
      },
    };
  }

  async updateUser(
    user: UserPayload & JwtPayload,
    dto: UpdateUserReqDto,
  ): Promise<{ user: UpdateUserResDto }> {
    const foundUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!foundUser) {
      throw new UnauthorizedException(`User id: ${user.id} not found`);
    }

    const updatedUser = this.userRepository.merge(foundUser, dto.user);
    await this.userRepository.save(updatedUser);

    return {
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        token: await this.generateAccessToken({ id: user.id }),
        bio: updatedUser.bio,
        image: updatedUser.image,
      },
    };
  }

  private async generateAccessToken(userPayload: UserPayload): Promise<string> {
    return await this.jwtService.signAsync(
      { id: userPayload.id },
      {
        secret: this.configService.getOrThrow('jwt.secret', { infer: true }),
        expiresIn: this.configService.getOrThrow('jwt.expiresIn', {
          infer: true,
        }),
      },
    );
  }
}
