import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppConfigModule } from './infrastructure/app-config/app-config.module';
import { DbModule } from './infrastructure/db/db.module';
import { MailerModule } from './infrastructure/mailer/mailer.module';
import { PublicControllerModule } from './controllers/public/public.controller.module';
import { AuthControllerModule } from './controllers/v1/auth/auth.controller.module';
import { CategoryControllerModule } from './controllers/v1/category/category.controller.module';
import { CollectionControllerModule } from './controllers/v1/collection/collection.controller.module';
import { ProductControllerModule } from './controllers/v1/product/product.controller.module';
import { ProductImageControllerModule } from './controllers/v1/product-image/product-image.controller.module';
import { PageControllerModule } from './controllers/v1/page/page.controller.module';
import { SettingControllerModule } from './controllers/v1/setting/setting.controller.module';
import { NewsletterControllerModule } from './controllers/v1/newsletter/newsletter.controller.module';
import { CookieConsentControllerModule } from './controllers/v1/cookie-consent/cookie-consent.controller.module';
import { MetalControllerModule } from './controllers/v1/metal/metal.controller.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.API_RATE_LIMIT_TTL || '60000', 10),
        limit: parseInt(process.env.API_RATE_LIMIT_LIMIT || '120', 10),
      },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.API_JWT_ACCESS_TOKEN_SECRET as string,
      signOptions: { expiresIn: process.env.API_JWT_ACCESS_TOKEN_EXPIRATION || '8h' },
    }),
    AppConfigModule,
    DbModule,
    MailerModule,
    PublicControllerModule,
    AuthControllerModule,
    CategoryControllerModule,
    CollectionControllerModule,
    ProductControllerModule,
    ProductImageControllerModule,
    PageControllerModule,
    SettingControllerModule,
    NewsletterControllerModule,
    CookieConsentControllerModule,
    MetalControllerModule,
  ],
})
export class AppModule {}
