import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenReqDto {
  @ApiProperty({
    description: 'Refresh token for obtaining a new access token',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
