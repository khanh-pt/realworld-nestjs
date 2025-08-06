import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @Get('/:username')
  async getProfile(@Param('username') username: string) {
    return await this.profileService.getProfile(username);
  }
}
