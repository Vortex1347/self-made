import { IsDateString, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsString()
  login: string;

  /** Обязателен при создании; при обновлении (тот же login) можно не передавать — пароль не меняется */
  @IsOptional()
  @ValidateIf((o) => o.password != null && o.password !== '')
  @IsString()
  @MinLength(4, { message: 'Пароль не менее 4 символов' })
  password?: string;

  @IsDateString()
  accessUntil: string;
}
