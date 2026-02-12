import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { SettingService } from '../../../services/setting/setting.service';
import { CookieConsentService } from '../../../services/cookie-consent/cookie-consent.service';
import { CookieConsentDto } from '../../../dto/cookie-consent/cookie-consent.dto';

@Controller('api/public/cookie-consent')
export class CookieConsentController {
  constructor(
    private readonly settingService: SettingService,
    private readonly consentService: CookieConsentService,
  ) {}

  @Get()
  async getConfig() {
    const settings = await this.settingService.findAll();
    return {
      text: settings['cookie_consent_text'] ?? 'Wir verwenden Cookies. Siehe Datenschutzerklärung.',
      policySlug: settings['cookie_policy_slug'] ?? 'datenschutz',
      categories: ['necessary', 'analytics'] as const,
    };
  }

  @Post()
  logConsent(@Body() dto: CookieConsentDto, @Req() req: Request) {
    const forwarded = req.headers['x-forwarded-for'];
    const ipAddress = Array.isArray(forwarded)
      ? forwarded[0]
      : (forwarded?.split(',')[0] || req.ip || null);
    const userAgent = req.headers['user-agent'] || null;
    return this.consentService.logConsent({
      consent: dto.consent,
      categories: dto.categories,
      ipAddress,
      userAgent,
    });
  }
}
