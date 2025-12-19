import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storage, GetSignedUrlConfig, Bucket } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { FileEntity } from './entities/file.entity';
import { CreateFileMetadataDto, PresignedUrlResponseDto } from './dto/file.dto';
import { AllConfigType } from '@/config/config.type';
import { FileResDto } from './dto/file.res.dto';
import { RoleEnum } from '../article-file/entities/article-file.entity';
import { RedisService } from '@/redis/redis.service';

@Injectable()
export class FileService {
  private readonly storage: Storage;
  private readonly bucket: Bucket;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly redisService: RedisService,
  ) {
    this.storage = new Storage({
      projectId: this.configService.getOrThrow('gcs.projectId', {
        infer: true,
      }),
      credentials: {
        client_email: this.configService.getOrThrow('gcs.clientEmail', {
          infer: true,
        }),
        private_key: this.configService.getOrThrow('gcs.privateKey', {
          infer: true,
        }),
      },
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

    const uploadUrl = await this.getSignedUrlForUpload({
      key,
      contentType: createFileDto.contentType,
      size: createFileDto.size,
    });

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

  async serializeFiles(
    fileInfos: { file: FileEntity; role: RoleEnum }[],
  ): Promise<FileResDto[]> {
    return Promise.all(
      fileInfos.map((fileInfo) => this.serializeFile(fileInfo)),
    );
  }

  async serializeFile(fileInfo: {
    file: FileEntity;
    role: RoleEnum;
  }): Promise<FileResDto> {
    const fileEntity = fileInfo.file;
    const url = await this.generateSignedUrlForDisplay(fileEntity.key);

    return {
      id: fileEntity.id,
      key: fileEntity.key,
      filename: fileEntity.filename,
      contentType: fileEntity.contentType,
      url,
      byteSize: fileEntity.byteSize,
      role: fileInfo.role,
      createdAt: fileEntity.createdAt,
      updatedAt: fileEntity.updatedAt,
    };
  }

  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
  }

  private async getSignedUrlForUpload({
    key,
    contentType,
    size,
  }: {
    key: string;
    contentType: string;
    size: number;
  }): Promise<string> {
    // Generate presigned URL for upload
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires:
        Date.now() +
        this.configService.getOrThrow('gcs.signedUrlExpires', { infer: true }) *
          1000,
      contentType,
      extensionHeaders: {
        'x-goog-content-length-range': `0,${size}`,
      },
    };

    const [signedUrl] = await this.bucket.file(key).getSignedUrl(options);
    return signedUrl;
  }

  private async generateSignedUrlForDisplay(key: string): Promise<string> {
    const cacheKey = `file:display-url:${key}`;
    const cachedUrl = await this.getCachedSignedUrl(cacheKey);
    if (cachedUrl) {
      return cachedUrl;
    }

    const expiresInSeconds = this.configService.getOrThrow(
      'gcs.signedUrlExpires',
      {
        infer: true,
      },
    );

    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read', // For reading/displaying files
      expires: Date.now() + expiresInSeconds * 1000,
    };

    const [signedUrl] = await this.bucket.file(key).getSignedUrl(options);
    await this.cacheSignedUrl(cacheKey, signedUrl, expiresInSeconds);

    return signedUrl;
  }

  private async getCachedSignedUrl(cacheKey: string): Promise<string | null> {
    try {
      return await this.redisService.getString(cacheKey);
    } catch {
      return null;
    }
  }

  private async cacheSignedUrl(
    cacheKey: string,
    url: string,
    expiresInSeconds: number,
  ): Promise<void> {
    const ttl = Math.max(1, expiresInSeconds - 60);

    try {
      await this.redisService.setString(cacheKey, url, ttl);
    } catch {
      return;
    }
  }
}
