import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminEntity } from '../../entities/admin.entity';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    JwtModule.register({
      secret: process.env.API_JWT_ACCESS_TOKEN_SECRET || 'change-me',
      signOptions: { expiresIn: process.env.API_JWT_ACCESS_TOKEN_EXPIRATION || '8h' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService, TypeOrmModule],
})
export class AuthServiceModule {}
