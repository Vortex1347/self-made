import { Module } from '@nestjs/common';
import { NewsletterPublicController } from './newsletter.controller';
import { NewsletterService } from '../../../services/newsletter/newsletter.service';
import { DbModule } from '../../../infrastructure/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [NewsletterPublicController],
  providers: [NewsletterService],
})
export class NewsletterControllerModule {}
