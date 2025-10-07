import { JwtPayload } from '@/api/jwt/types/jwt-payload.type';
import { UserPayload } from '@/api/jwt/types/user-payload.type';
import { UserService } from '@/api/user/user.service';
import { AllConfigType } from '@/config/config.type';
import { IS_PUBLIC } from '@/constants/app.constant';
import { CurrentUser } from 'src/types/request.type';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private jwtService: JwtService,
    private userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractTokenFromHeader(request);

    if (!accessToken) {
      throw new UnauthorizedException('Access token is missing');
    }

    try {
      const payload = this.jwtService.verify<UserPayload & JwtPayload>(
        accessToken,
        {
          secret: this.configService.getOrThrow('jwt.secret', {
            infer: true,
          }),
        },
      );
      const user = await this.userService.findById(payload.id);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const currentUser: CurrentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        image: user.image,
      };

      request['currentUser'] = currentUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unauthorized';
      throw new UnauthorizedException(errorMessage);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Token' ? token : undefined;
  }
}
