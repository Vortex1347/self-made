import { Module } from '@nestjs/common';
import { TopicCommentController } from './topic-comment.controller';
import { StudentServiceModule } from '../../../services/student/student.service.module';
import { CommentServiceModule } from '../../../services/comment/comment.service.module';

@Module({
  imports: [StudentServiceModule, CommentServiceModule],
  controllers: [TopicCommentController],
})
export class TopicCommentControllerModule {}
