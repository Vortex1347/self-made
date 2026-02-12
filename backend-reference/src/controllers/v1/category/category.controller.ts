import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, Query } from '@nestjs/common';
import { CategoryService } from '../../../services/category/category.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CreateCategoryDto } from '../../../dto/category/create-category.dto';
import { UpdateCategoryDto } from '../../../dto/category/update-category.dto';

@Controller('api/v1/categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

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
  create(@Body() body: unknown) {
    let parsed: unknown = body;
    if (typeof body === 'string') {
      try {
        parsed = JSON.parse(body);
      } catch {
        parsed = body;
      }
    }
    if (parsed instanceof Uint8Array) {
      try {
        parsed = JSON.parse(Buffer.from(parsed).toString('utf8'));
      } catch {
        parsed = parsed;
      }
    }
    if (parsed && (parsed as { type?: string }).type === 'Buffer' && Array.isArray((parsed as { data?: unknown }).data)) {
      try {
        parsed = JSON.parse(Buffer.from((parsed as { data: number[] }).data).toString('utf8'));
      } catch {
        parsed = parsed;
      }
    }
    const raw =
      parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    const name = typeof raw.name === 'string' ? raw.name.trim() : '';
    const slug = typeof raw.slug === 'string' ? raw.slug.trim() : (name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '');
    if (!name) throw new BadRequestException('name must not be empty');
    if (!slug) throw new BadRequestException('slug must not be empty');
    const dto: CreateCategoryDto = {
      name,
      slug,
      sortOrder: typeof raw.sortOrder === 'number' ? raw.sortOrder : typeof raw.sortOrder === 'string' ? parseInt(raw.sortOrder, 10) || 0 : 0,
      isVisible: typeof raw.isVisible === 'boolean' ? raw.isVisible : raw.isVisible !== false,
      showInHeader: typeof raw.showInHeader === 'boolean' ? raw.showInHeader : raw.showInHeader === true,
    };
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
