import { Request } from 'express';

export type CurrentUser = {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  image: string | null;
};

export interface AuthenticatedRequest extends Request {
  currentUser: CurrentUser;
}
