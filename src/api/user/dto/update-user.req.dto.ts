import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UserData {
  @ApiProperty({
    description: 'Updated username for the user account',
    example: 'johndoe_updated',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Updated email address for the user',
    example: 'john.updated@example.com',
    format: 'email',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Updated password for the user account (minimum 6 characters)',
    example: 'newpassword123',
    minLength: 6,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: 'User biography or description',
    example:
      'Software developer passionate about building amazing applications',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'URL to user profile image',
    example: 'https://example.com/profile-images/johndoe.jpg',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateUserReqDto {
  @ApiProperty({
    description: 'User data to update',
    type: UserData,
  })
  @ValidateNested()
  @Type(() => UserData)
  user: UserData;
}
