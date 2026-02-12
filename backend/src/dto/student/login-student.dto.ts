import { IsString, MinLength } from 'class-validator';

export class LoginStudentDto {
  @IsString()
  login: string;

  @IsString()
  @MinLength(4)
  password: string;
}
