import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { StudentServiceModule } from '../../../services/student/student.service.module';
import { CourseServiceModule } from '../../../services/course/course.service.module';

@Module({
  imports: [StudentServiceModule, CourseServiceModule],
  controllers: [CourseController],
})
export class CourseControllerModule {}
