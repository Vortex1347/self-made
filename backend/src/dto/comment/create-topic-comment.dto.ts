import { IsString, MaxLength } from 'class-validator';

export class CreateTopicCommentDto {
  @IsString()
  @MaxLength(1500)
  text: string;
}
