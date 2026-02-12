import { Controller, Get } from '@nestjs/common';

@Controller('api/public/health')
export class HealthController {
  @Get()
  health() {
    return { ok: true, timestamp: new Date().toISOString() };
  }
}
