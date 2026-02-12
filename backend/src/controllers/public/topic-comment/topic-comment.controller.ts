import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { StudentJwtAuthGuard } from '../../../common/guards/student-jwt-auth.guard';
import { StudentEntity } from '../../../entities/student.entity';
import { StudentService } from '../../../services/student/student.service';
import { CommentService } from '../../../services/comment/comment.service';
import { CreateTopicCommentDto } from '../../../dto/comment/create-topic-comment.dto';
import { UpdateTopicCommentDto } from '../../../dto/comment/update-topic-comment.dto';

@Controller('api/public/topics/:topicId/comments')
@UseGuards(StudentJwtAuthGuard)
export class TopicCommentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly commentService: CommentService,
  ) {}

  @Get()
  list(@Request() req: { user: StudentEntity }, @Param('topicId') topicId: string) {
    this.studentService.requireAccess(req.user);
    return this.commentService.listByTopic(topicId);
  }

  @Post()
  create(
    @Request() req: { user: StudentEntity },
    @Param('topicId') topicId: string,
    @Body() dto: CreateTopicCommentDto,
  ) {
    this.studentService.requireAccess(req.user);
    return this.commentService.create(topicId, req.user, dto.text);
  }

  @Patch(':id')
  update(
    @Request() req: { user: StudentEntity },
    @Param('id') commentId: string,
    @Body() dto: UpdateTopicCommentDto,
  ) {
    this.studentService.requireAccess(req.user);
    return this.commentService.updateOwn(commentId, req.user.id, dto.text);
  }

  @Delete(':id')
  delete(@Request() req: { user: StudentEntity }, @Param('id') commentId: string) {
    this.studentService.requireAccess(req.user);
    return this.commentService.deleteOwn(commentId, req.user.id);
  }
}
