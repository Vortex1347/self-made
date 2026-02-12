import { Module } from '@nestjs/common';
import { StudentAuthController } from './student-auth.controller';
import { StudentServiceModule } from '../../../services/student/student.service.module';

@Module({
  imports: [StudentServiceModule],
  controllers: [StudentAuthController],
})
export class StudentAuthControllerModule {}
