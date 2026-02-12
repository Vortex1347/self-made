import { IsString, MaxLength } from 'class-validator';

export class UpdateTopicCommentDto {
  @IsString()
  @MaxLength(1500)
  text: string;
}
