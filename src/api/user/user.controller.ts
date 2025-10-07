import { Body, Controller, Post } from '@nestjs/common';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  async register(
    @Body() dto: RegisterReqDto,
  ): Promise<{ user: RegisterResDto }> {
    return await this.userService.register(dto);
  }

  @Post('users/login')
  async login(@Body() dto: LoginReqDto): Promise<{ user: LoginResDto }> {
    return await this.userService.login(dto);
  }
}
