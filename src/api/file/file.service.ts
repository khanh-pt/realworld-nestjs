import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storage, GetSignedUrlConfig, Bucket } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { FileEntity } from './entities/file.entity';
import { CreateFileMetadataDto, PresignedUrlResponseDto } from './dto/file.dto';
import { AllConfigType } from '@/config/config.type';

@Injectable()
export class FileService {
  private readonly storage: Storage;
  private readonly bucket: Bucket;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {
    this.storage = new Storage({
      projectId: this.configService.getOrThrow('gcs.projectId', {
        infer: true,
      }),
      keyFilename: this.configService.getOrThrow('gcs.keyFilename', {
        infer: true,
      }),
    });
    this.bucket = this.storage.bucket(
      this.configService.getOrThrow('gcs.bucketName', { infer: true }),
    );
  }

  async createPresignedUrl(
    createFileDto: CreateFileMetadataDto,
  ): Promise<PresignedUrlResponseDto> {
    // Validate file type (only jpg, png)
    const allowedContentTypes = ['image/jpeg', 'image/png'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = this.getFileExtension(
      createFileDto.filename,
    ).toLowerCase();
    if (
      !allowedContentTypes.includes(createFileDto.contentType) ||
      !allowedExtensions.includes(fileExtension)
    ) {
      throw new Error('Only JPG and PNG image files are allowed.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (createFileDto.size > maxSize) {
      throw new Error('File size must not exceed 5MB.');
    }

    // Check if file with same checksum already exists
    const existingFile = await this.fileRepository.findOne({
      where: { checksum: createFileDto.checksum },
    });

    if (existingFile) {
      return {
        fileId: existingFile.id,
        key: existingFile.key,
        exists: true,
        uploadUrl: null,
      };
    }

    // Generate unique key for the file
    const key = `uploads/${uuidv4()}${fileExtension}`;

    // Create file record in database
    const fileEntity = this.fileRepository.create({
      key,
      filename: createFileDto.filename,
      contentType: createFileDto.contentType,
      serviceName: 'gcs',
      byteSize: createFileDto.size,
      checksum: createFileDto.checksum,
    });

    const savedFile = await this.fileRepository.save(fileEntity);

    // Generate presigned URL for upload
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires:
        Date.now() +
        this.configService.getOrThrow('gcs.signedUrlExpires', { infer: true }) *
          1000,
      contentType: createFileDto.contentType,
      extensionHeaders: {
        'x-goog-content-length-range': `0,${createFileDto.size}`,
      },
    };

    const [uploadUrl] = await this.bucket.file(key).getSignedUrl(options);

    return {
      fileId: savedFile.id,
      key,
      exists: false,
      uploadUrl,
    };
  }

  async findByIdAndKey(id: number, key: string): Promise<FileEntity | null> {
    return this.fileRepository.findOne({
      where: { id, key },
    });
  }

  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
  }
}
