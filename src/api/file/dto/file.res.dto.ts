import { RoleEnum } from '@/api/article-file/entities/article-file.entity';

export class FileResDto {
  id: number;
  key: string;
  filename: string;
  contentType: string;
  url: string;
  byteSize: number;
  role: RoleEnum;
  createdAt: Date;
  updatedAt: Date;
}
