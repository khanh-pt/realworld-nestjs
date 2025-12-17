import { FileResDto } from '@/api/file/dto/file.res.dto';
import { CurrentUser } from 'src/types/request.type';

export class GetArticleResDto {
  id: number;
  title: string;
  slug: string;
  body: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  description: string;
  tagList: string[];
  author: {
    id: number;
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
  favorited: boolean;
  favoritesCount: number;
  files: FileResDto[] | [];
}
