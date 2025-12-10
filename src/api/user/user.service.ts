import { AllConfigType } from '@/config/config.type';
import { verifyPassword } from '@/utils/hashing.util';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { UserPayload } from '../jwt/types/user-payload.type';
import { GetUserResDto } from './dto/get-user.res.dto';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { UpdateUserReqDto } from './dto/update-user.req.dto';
import { UpdateUserResDto } from './dto/update-user.res.dto';
import { UserEntity } from './entities/user.entity';
import { CurrentUser } from 'src/types/request.type';
import { RefreshTokenResDto } from './dto/refresh-token.res.dto';
import { SessionPayload } from '../jwt/types/session-payload.type';
import { SessionEntity } from './entities/session.entity';
import * as crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ValidationError } from 'class-validator/types/validation/ValidationError';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async register(dto: RegisterReqDto): Promise<{ user: RegisterResDto }> {
    const errors: ValidationError[] = [];
    const isExistUserName = await this.userRepository.exists({
      where: { username: dto.user.username },
    });

    if (isExistUserName) {
      const err = {
        property: 'username',
        constraints: {
          unique: 'Username already exists',
        },
      };
      errors.push(err);
    }

    const isExistEmail = await this.userRepository.exists({
      where: { email: dto.user.email },
    });

    if (isExistEmail) {
      const err = {
        property: 'email',
        constraints: {
          unique: 'Email already exists',
        },
      };
      errors.push(err);
    }

    if (errors.length > 0) {
      throw new UnprocessableEntityException({ message: errors });
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

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = this.sessionRepository.create({
      userId: user.id,
      hash,
    });
    await this.sessionRepository.save(session);

    return {
      user: {
        username: user.username,
        email: user.email,
        token: await this.generateAccessToken({ id: user.id }),
        refreshToken: await this.generateRefreshToken({
          id: session.id,
          hash,
        }),
        bio: user.bio,
        image: user.image,
      },
    };
  }

  async getUser(currentUser: CurrentUser): Promise<{ user: GetUserResDto }> {
    return {
      user: {
        username: currentUser.username,
        email: currentUser.email,
        token: await this.generateAccessToken({ id: currentUser.id }),
        bio: currentUser.bio,
        image: currentUser.image,
      },
    };
  }

  async updateUser(
    currentUser: CurrentUser,
    dto: UpdateUserReqDto,
  ): Promise<{ user: UpdateUserResDto }> {
    const foundUser = await this.userRepository.findOneOrFail({
      where: { id: currentUser.id },
    });

    const updatedUser = this.userRepository.merge(foundUser, dto.user);
    await this.userRepository.save(updatedUser);

    return {
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        token: await this.generateAccessToken({ id: currentUser.id }),
        bio: updatedUser.bio,
        image: updatedUser.image,
      },
    };
  }

  async findById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResDto> {
    const payload = await this.jwtService.verifyAsync<SessionPayload>(
      refreshToken,
      {
        secret: this.configService.getOrThrow('jwt.refreshSecret', {
          infer: true,
        }),
      },
    );

    const session = await this.sessionRepository.findOne({
      where: { id: payload.id },
    });
    if (!session || session.hash !== payload.hash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findOne({
      where: { id: session.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newHash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    this.sessionRepository.merge(session, { hash: newHash });
    await this.sessionRepository.save(session);

    const newAccessToken = await this.generateAccessToken({ id: user.id });
    const newRefreshToken = await this.generateRefreshToken({
      id: session.id,
      hash: newHash,
    });

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken,
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

  private async generateRefreshToken(
    sessionPayload: SessionPayload,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      { id: sessionPayload.id, hash: sessionPayload.hash },
      {
        secret: this.configService.getOrThrow('jwt.refreshSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('jwt.refreshExpiresIn', {
          infer: true,
        }),
      },
    );
  }
}
