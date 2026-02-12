import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from '../../../services/category/category.service';
import { DbModule } from '../../../infrastructure/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryControllerModule {}
