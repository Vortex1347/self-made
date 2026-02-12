import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthServiceModule } from '../../../services/auth/auth.service.module';

@Module({
  imports: [AuthServiceModule],
  controllers: [AuthController],
})
export class AuthControllerModule {}
