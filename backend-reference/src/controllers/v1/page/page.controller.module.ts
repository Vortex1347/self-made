import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from '../../../services/page/page.service';
import { DbModule } from '../../../infrastructure/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [PageController],
  providers: [PageService],
})
export class PageControllerModule {}
