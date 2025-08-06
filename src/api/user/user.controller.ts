import { Body, Controller, Get, Post, Put, Request } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { AuthenticatedRequest } from 'src/types/request.type';
import { GetUserResDto } from './dto/get-user.res.dto';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { UpdateUserReqDto } from './dto/update-user.req.dto';
import { UpdateUserResDto } from './dto/update-user.res.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('users')
  async register(
    @Body() dto: RegisterReqDto,
  ): Promise<{ user: RegisterResDto }> {
    return await this.userService.register(dto);
  }

  @Public()
  @Post('users/login')
  async login(@Body() dto: LoginReqDto): Promise<{ user: LoginResDto }> {
    return await this.userService.login(dto);
  }

  @Get('user')
  async getUser(
    @Request() req: AuthenticatedRequest,
  ): Promise<{ user: GetUserResDto }> {
    return await this.userService.getUser(req.currentUser);
  }

  @Put('user')
  async updateUser(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateUserReqDto,
  ): Promise<{ user: UpdateUserResDto }> {
    return await this.userService.updateUser(req.currentUser, dto);
  }
}
