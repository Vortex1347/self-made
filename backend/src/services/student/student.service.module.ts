import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { StudentEntity } from '../../entities/student.entity';
import { StudentService } from './student.service';
import { StudentJwtStrategy } from '../../common/strategies/student-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentEntity]),
    JwtModule.register({
      secret: process.env.API_JWT_ACCESS_TOKEN_SECRET as string,
      signOptions: { expiresIn: process.env.API_JWT_ACCESS_TOKEN_EXPIRATION || '8h' },
    }),
  ],
  providers: [StudentService, StudentJwtStrategy],
  exports: [StudentService],
})
export class StudentServiceModule {}
