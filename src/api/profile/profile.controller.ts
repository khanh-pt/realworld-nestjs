import { Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { AuthenticatedRequest } from 'src/types/request.type';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @Get('/:username')
  async getProfile(@Param('username') username: string) {
    return await this.profileService.getProfile(username);
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
