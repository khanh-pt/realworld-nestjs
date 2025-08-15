export class CreateCommentResDto {
  id: number;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  body: string;
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
}
