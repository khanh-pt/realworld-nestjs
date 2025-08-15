import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class CommentData {
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class CreateCommentReqDto {
  @ValidateNested()
  @Type(() => CommentData)
  comment: CommentData;
}
