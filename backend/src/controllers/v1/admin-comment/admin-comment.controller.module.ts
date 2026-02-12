import { Module } from '@nestjs/common';
import { AdminCommentController } from './admin-comment.controller';
import { CommentServiceModule } from '../../../services/comment/comment.service.module';

@Module({
  imports: [CommentServiceModule],
  controllers: [AdminCommentController],
})
export class AdminCommentControllerModule {}
