import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CollectionService } from '../../../services/collection/collection.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('api/v1/collections')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private readonly service: CollectionService) {}

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (page != null || limit != null) {
      return this.service.findAllPaged({
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
      });
    }
    return this.service.findAll();
  }

  @Post()
  create(
    @Body()
    dto: { name: string; slug: string; description?: string; sortOrder?: number; isLimited?: boolean },
  ) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    dto: {
      name?: string;
      slug?: string;
      description?: string;
      sortOrder?: number;
      isLimited?: boolean;
    },
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
