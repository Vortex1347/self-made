import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CookieConsentDto {
  @IsBoolean()
  consent: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}
