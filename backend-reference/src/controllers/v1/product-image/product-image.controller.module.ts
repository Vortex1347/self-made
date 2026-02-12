import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImageController } from './product-image.controller';
import { ProductImageService } from '../../../services/product-image/product-image.service';
import { ProductImageEntity } from '../../../entities/product-image.entity';
import { ProductEntity } from '../../../entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImageEntity, ProductEntity])],
  controllers: [ProductImageController],
  providers: [ProductImageService],
})
export class ProductImageControllerModule {}
