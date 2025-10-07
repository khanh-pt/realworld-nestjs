import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Matches,
} from 'class-validator';

export class CreateFileMetadataDto {
  @ApiProperty({
    description: 'Original filename of the file',
    example: 'document.pdf',
  })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty({
    description: 'Size of the file in bytes',
    example: 1024000,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  size: number;

  @ApiProperty({
    description: 'SHA-256 checksum of the file content',
    example: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-fA-F0-9]{64}$/, {
    message: 'Checksum must be a valid SHA-256 hash (64 hex characters)',
  })
  checksum: string;
}

export class PresignedUrlResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the file record',
    example: 123,
  })
  fileId: number;

  @ApiProperty({
    description: 'Unique key/path for the file in cloud storage',
    example: 'uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.pdf',
  })
  key: string;

  @ApiProperty({
    description: 'Whether the file already exists (no upload needed)',
    example: false,
  })
  exists: boolean;

  @ApiProperty({
    description:
      'Presigned URL for uploading the file (null if file already exists)',
    example:
      'https://storage.googleapis.com/bucket-name/uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.pdf?...',
    nullable: true,
  })
  uploadUrl: string | null;
}
