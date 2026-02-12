import { Controller, Get, Query, Param } from '@nestjs/common';
import { PublicService } from '../../services/public/public.service';
import { PublicProductsQueryDto } from '../../dto/public/products-query.dto';

@Controller('api/public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('categories')
  getCategories() {
    return this.publicService.getCategories();
  }

  @Get('metals')
  getMetals() {
    return this.publicService.getMetals();
  }

  @Get('collections')
  getCollections() {
    return this.publicService.getCollections();
  }

  @Get('products')
  getProducts(@Query() query: PublicProductsQueryDto) {
    return this.publicService.getProducts({
      page: query.page ?? 1,
      limit: query.limit ?? 12,
      categoryIds: query.categoryId?.length ? query.categoryId : undefined,
      collectionIds: query.collectionId?.length ? query.collectionId : undefined,
      material: query.material,
      priceMin: query.priceMin,
      priceMax: query.priceMax,
      priceOnRequest: query.priceOnRequest,
      sort: query.sort,
    });
  }

  @Get('products/:slug')
  getProductBySlug(@Param('slug') slug: string) {
    return this.publicService.getProductBySlug(slug);
  }

  @Get('pages/:slug')
  getPage(@Param('slug') slug: string) {
    return this.publicService.getPage(slug);
  }

  @Get('settings')
  getSettings() {
    return this.publicService.getSettings();
  }
}
