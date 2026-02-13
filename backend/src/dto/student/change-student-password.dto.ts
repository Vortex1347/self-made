import { IsString, MinLength } from 'class-validator';

export class ChangeStudentPasswordDto {
  @IsString()
  @MinLength(4)
  currentPassword: string;

  @IsString()
  @MinLength(4)
  newPassword: string;
}
