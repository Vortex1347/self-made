import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MetalService } from '../../../services/metal/metal.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('api/v1/metals')
@UseGuards(JwtAuthGuard)
export class MetalController {
  constructor(private readonly service: MetalService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: { name: string; sortOrder?: number }) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: { name?: string; sortOrder?: number }) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
