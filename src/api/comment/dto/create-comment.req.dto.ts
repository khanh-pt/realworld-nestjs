import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CommentData {
  @ApiProperty({
    description: 'The content of the comment',
    example:
      'Great article! I learned a lot from this. Thank you for sharing your knowledge.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class CreateCommentReqDto {
  @ApiProperty({
    description: 'Comment data to create',
    type: CommentData,
  })
  @ValidateNested()
  @Type(() => CommentData)
  comment: CommentData;
}
