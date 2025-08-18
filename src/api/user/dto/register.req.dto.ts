import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UserData {
  @ApiProperty({
    description: 'Username for the user account',
    example: 'johndoe',
    minLength: 1,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Valid email address for the user',
    example: 'john.doe@example.com',
    format: 'email',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user account (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterReqDto {
  @ApiProperty({
    description: 'User registration data',
    type: UserData,
  })
  @ValidateNested()
  @Type(() => UserData)
  user: UserData;
}
