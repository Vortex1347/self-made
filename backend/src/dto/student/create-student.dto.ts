import { IsDateString, IsString, MinLength } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsString()
  login: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsDateString()
  accessUntil: string;
}
