import { Module } from '@nestjs/common';
import { AdminCourseController } from './admin-course.controller';
import { CourseServiceModule } from '../../../services/course/course.service.module';

@Module({
  imports: [CourseServiceModule],
  controllers: [AdminCourseController],
})
export class AdminCourseControllerModule {}
