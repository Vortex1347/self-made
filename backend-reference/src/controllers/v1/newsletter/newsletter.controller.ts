import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { NewsletterService } from '../../../services/newsletter/newsletter.service';
import { NewsletterSubscribeDto } from '../../../dto/newsletter/subscribe.dto';

@Controller('api/public/newsletter')
export class NewsletterPublicController {
  constructor(private readonly service: NewsletterService) {}

  @Post('subscribe')
  subscribe(@Body() dto: NewsletterSubscribeDto) {
    return this.service.subscribe(dto.email, dto.consent);
  }

  @Get('confirm')
  confirm(@Query('token') token: string) {
    return this.service.confirm(token);
  }

  @Get('unsubscribe')
  unsubscribe(@Query('token') token: string) {
    return this.service.unsubscribe(token);
  }
}
