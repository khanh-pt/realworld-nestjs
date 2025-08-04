import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  async register(
    @Body() dto: RegisterReqDto,
  ): Promise<{ user: RegisterResDto }> {
    return await this.userService.register(dto);
  }
}
