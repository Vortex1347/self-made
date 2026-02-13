import { IsArray, IsBoolean, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class AdminUpsertTopicDto {
  @IsUUID()
  moduleId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @IsOptional()
  @IsArray()
  contentBlocks?: unknown[];

  @IsOptional()
  trainer?: unknown | null;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
