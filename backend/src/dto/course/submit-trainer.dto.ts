import { IsOptional, IsString } from 'class-validator';

export class SubmitTrainerDto {
  @IsString()
  type: string;

  @IsOptional()
  answer?: unknown;
}
