import { IsDateString } from 'class-validator';

export class UpdateStudentAccessDto {
  @IsDateString()
  accessUntil: string;
}
