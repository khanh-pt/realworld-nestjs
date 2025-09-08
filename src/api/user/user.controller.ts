import { Body, Controller, Get, Post, Put, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnprocessableEntityResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
import { RefreshTokenReqDto } from './dto/refresh-token.req.dto';
import { RefreshTokenResDto } from './dto/refresh-token.res.dto';

@ApiTags('Users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('users')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user account with username, email, and password',
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
    schema: {
      example: {
        user: {
          id: 1,
          username: 'johndoe',
          email: 'john.doe@example.com',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          bio: null,
          image: null,
        },
      },
    },
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation failed',
    schema: {
      example: {
        statusCode: 422,
        message: [
          'email must be an email',
          'password must be longer than or equal to 6 characters',
        ],
        error: 'Unprocessable Entity',
      },
    },
  })
  async register(
    @Body() dto: RegisterReqDto,
  ): Promise<{ user: RegisterResDto }> {
    return await this.userService.register(dto);
  }

  @Public()
  @Post('users/login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password',
  })
  @ApiOkResponse({
    description: 'User successfully authenticated',
    schema: {
      example: {
        user: {
          id: 1,
          username: 'johndoe',
          email: 'john.doe@example.com',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          bio: 'Software developer',
          image: 'https://example.com/profile.jpg',
        },
      },
    },
  })
  @ApiUnprocessableEntityResponse({ description: 'Invalid credentials' })
  async login(@Body() dto: LoginReqDto): Promise<{ user: LoginResDto }> {
    return await this.userService.login(dto);
  }

  async refreshToken(
    @Body() dto: RefreshTokenReqDto,
  ): Promise<RefreshTokenResDto> {
    return await this.userService.refreshToken(dto.refreshToken);
  }

  @Get('user')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Get the currently authenticated user information',
  })
  @ApiOkResponse({
    description: 'Current user information',
    schema: {
      example: {
        user: {
          id: 1,
          username: 'johndoe',
          email: 'john.doe@example.com',
          bio: 'Software developer',
          image: 'https://example.com/profile.jpg',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getUser(
    @Request() req: AuthenticatedRequest,
  ): Promise<{ user: GetUserResDto }> {
    return await this.userService.getUser(req.currentUser);
  }

  @Put('user')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update current user',
    description: 'Update the currently authenticated user profile',
  })
  @ApiOkResponse({
    description: 'User successfully updated',
    schema: {
      example: {
        user: {
          id: 1,
          username: 'johndoe_updated',
          email: 'john.updated@example.com',
          bio: 'Updated bio',
          image: 'https://example.com/new-profile.jpg',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiUnprocessableEntityResponse({ description: 'Validation failed' })
  async updateUser(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateUserReqDto,
  ): Promise<{ user: UpdateUserResDto }> {
    return await this.userService.updateUser(req.currentUser, dto);
  }
}
