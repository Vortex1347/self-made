import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductImageDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder: number;
}
