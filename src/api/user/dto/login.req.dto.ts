import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UserData {
  @ApiProperty({
    description: 'Email address for login',
    example: 'john.doe@example.com',
    format: 'email',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for login (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginReqDto {
  @ApiProperty({
    description: 'User login credentials',
    type: UserData,
  })
  @ValidateNested()
  @Type(() => UserData)
  user: UserData;
}
