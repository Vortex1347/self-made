import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingService } from '../../../services/setting/setting.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('api/v1/settings')
@UseGuards(JwtAuthGuard)
export class SettingController {
  constructor(private readonly service: SettingService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Put()
  update(@Body() dto: Record<string, string>) {
    return this.service.update(dto);
  }
}
