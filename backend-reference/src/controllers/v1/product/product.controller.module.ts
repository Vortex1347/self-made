import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from '../../../services/product/product.service';
import { DbModule } from '../../../infrastructure/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductControllerModule {}
