import { FileResDto } from '@/api/file/dto/file.res.dto';

export class CreateArticleResDto {
  id: number;
  title: string;
  slug: string;
  body: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  description: string;
  tagList: string[];
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
  favorited: boolean;
  favoritesCount: number;
  files: FileResDto[] | [];
}
