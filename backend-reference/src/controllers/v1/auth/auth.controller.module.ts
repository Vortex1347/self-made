import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthServiceModule } from '../../../services/auth/auth.service.module';
import { JwtStrategy } from '../../../common/strategies/jwt.strategy';

@Module({
  imports: [PassportModule, AuthServiceModule],
  controllers: [AuthController],
  providers: [JwtStrategy],
})
export class AuthControllerModule {}
