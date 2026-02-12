import { Module } from '@nestjs/common';
import { MetalController } from './metal.controller';
import { MetalService } from '../../../services/metal/metal.service';
import { DbModule } from '../../../infrastructure/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [MetalController],
  providers: [MetalService],
})
export class MetalControllerModule {}
