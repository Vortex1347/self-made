import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { AdminEntity } from '../../entities/admin.entity';
import { CategoryEntity } from '../../entities/category.entity';
import { CollectionEntity } from '../../entities/collection.entity';
import { ProductEntity } from '../../entities/product.entity';
import { ProductImageEntity } from '../../entities/product-image.entity';
import { PageEntity } from '../../entities/page.entity';
import { SettingEntity } from '../../entities/setting.entity';
import { NewsletterSubscriberEntity } from '../../entities/newsletter-subscriber.entity';
import { CookieConsentEntity } from '../../entities/cookie-consent.entity';
import { MetalEntity } from '../../entities/metal.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      synchronize: process.env.API_ENVIRONMENT === 'develop',
    }),
    TypeOrmModule.forFeature([
      AdminEntity,
      CategoryEntity,
      CollectionEntity,
      ProductEntity,
      ProductImageEntity,
      PageEntity,
      SettingEntity,
      NewsletterSubscriberEntity,
      CookieConsentEntity,
      MetalEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DbModule {}
