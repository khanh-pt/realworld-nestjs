import { Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { AuthenticatedRequest, CurrentUser } from 'src/types/request.type';
import { ProfileService } from './profile.service';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { AuthOptional } from 'src/decorators/auth-optional.decorator';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @AuthOptional()
  @Get('/:username')
  async getProfile(
    @Param('username') username: string,
    @GetCurrentUser() currentUser?: CurrentUser,
  ) {
    return await this.profileService.getProfile(username, currentUser);
  }

  @Post('/:username/follow')
  async followUser(
    @Request() req: AuthenticatedRequest,
    @Param('username') username: string,
  ) {
    return await this.profileService.followUser(req.currentUser.id, username);
  }

  @Delete('/:username/follow')
  async unfollowUser(
    @Request() req: AuthenticatedRequest,
    @Param('username') username: string,
  ) {
    return await this.profileService.unfollowUser(req.currentUser.id, username);
  }
}
