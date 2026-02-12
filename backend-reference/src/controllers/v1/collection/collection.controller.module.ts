import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from '../../../services/collection/collection.service';
import { DbModule } from '../../../infrastructure/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionControllerModule {}
