import { Controller, Get, Put, Post, Param, Body, UseGuards } from '@nestjs/common';
import { PageService } from '../../../services/page/page.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('api/v1/pages')
@UseGuards(JwtAuthGuard)
export class PageController {
  constructor(private readonly service: PageService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.service.findOne(slug);
  }

  @Post()
  create(@Body() dto: { slug: string; title: string; content: string }) {
    return this.service.create(dto);
  }

  @Put(':slug')
  update(
    @Param('slug') slug: string,
    @Body() dto: { title?: string; content?: string; contentBlocks?: Array<{ type: string; content: string }> }
  ) {
    return this.service.update(slug, dto);
  }
}
