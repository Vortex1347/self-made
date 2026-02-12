import { Module } from '@nestjs/common';
import { AdminStudentController } from './admin-student.controller';
import { StudentServiceModule } from '../../../services/student/student.service.module';

@Module({
  imports: [StudentServiceModule],
  controllers: [AdminStudentController],
})
export class AdminStudentControllerModule {}
