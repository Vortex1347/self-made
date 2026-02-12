import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieConsentController } from './cookie-consent.controller';
import { SettingControllerModule } from '../setting/setting.controller.module';
import { CookieConsentService } from '../../../services/cookie-consent/cookie-consent.service';
import { CookieConsentEntity } from '../../../entities/cookie-consent.entity';

@Module({
  imports: [SettingControllerModule, TypeOrmModule.forFeature([CookieConsentEntity])],
  controllers: [CookieConsentController],
  providers: [CookieConsentService],
})
export class CookieConsentControllerModule {}
