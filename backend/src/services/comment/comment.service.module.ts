import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { TopicCommentEntity } from '../../entities/topic-comment.entity';
import { CourseTopicEntity } from '../../entities/course-topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TopicCommentEntity, CourseTopicEntity])],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentServiceModule {}
