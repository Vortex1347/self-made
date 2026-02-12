import { IsBoolean, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class NewsletterSubscribeDto {
  @IsEmail()
  email: string;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  consent: boolean;
}
