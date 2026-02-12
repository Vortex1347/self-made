import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from '../../services/public/public.service';
import { DbModule } from '../../infrastructure/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicControllerModule {}
