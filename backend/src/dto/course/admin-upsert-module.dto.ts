import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AdminUpsertModuleDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
