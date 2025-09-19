import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileService } from './file.service';
import { CreateFileMetadataDto, PresignedUrlResponseDto } from './dto/file.dto';

@ApiTags('files')
@ApiBearerAuth()
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('presigned-url')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get presigned URL for file upload',
    description:
      'Creates a file record and returns a presigned URL for direct upload to Google Cloud Storage. If a file with the same checksum already exists, returns the existing file information.',
  })
  @ApiResponse({
    status: 200,
    description: 'Presigned URL generated successfully or existing file found',
    type: PresignedUrlResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file metadata',
  })
  async createPresignedUrl(
    @Body() createFileDto: CreateFileMetadataDto,
  ): Promise<PresignedUrlResponseDto> {
    return this.fileService.createPresignedUrl(createFileDto);
  }
}
