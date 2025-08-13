import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedRequest, CurrentUser } from 'src/types/request.type';

export const GetCurrentUser = createParamDecorator(
  (
    data: string,
    ctx: ExecutionContext,
  ): CurrentUser | undefined | string | number | null => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request | AuthenticatedRequest>();

    let user: CurrentUser | undefined;
    if ('currentUser' in request) {
      user = request['currentUser']; // request['currentUser'] is set in the AuthGuard
    }

    if (!user) {
      return undefined;
    }
    if (data) {
      return user[data as keyof CurrentUser];
    }
    return user;
  },
);
