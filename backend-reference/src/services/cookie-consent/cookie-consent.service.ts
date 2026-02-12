import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CookieConsentEntity } from '../../entities/cookie-consent.entity';

@Injectable()
export class CookieConsentService {
  constructor(@InjectRepository(CookieConsentEntity) private repo: Repository<CookieConsentEntity>) {}

  async logConsent(params: {
    consent: boolean;
    categories?: string[];
    ipAddress?: string | null;
    userAgent?: string | null;
  }) {
    const row = this.repo.create({
      consent: params.consent,
      categories: params.categories ?? null,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
    });
    await this.repo.save(row);
    return { success: true };
  }
}
