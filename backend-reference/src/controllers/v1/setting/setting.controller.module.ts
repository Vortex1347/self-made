import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from '../../../services/setting/setting.service';
import { DbModule } from '../../../infrastructure/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingControllerModule {}
