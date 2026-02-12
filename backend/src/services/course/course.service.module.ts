import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseModuleEntity } from '../../entities/course-module.entity';
import { CourseTopicEntity } from '../../entities/course-topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseModuleEntity, CourseTopicEntity])],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseServiceModule {}
