import { JwtPayload } from '@/api/jwt/types/jwt-payload.type';
import { UserPayload } from '@/api/jwt/types/user-payload.type';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: UserPayload & JwtPayload;
}
