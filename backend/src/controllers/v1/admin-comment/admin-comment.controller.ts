import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CommentService } from '../../../services/comment/comment.service';
import { UpdateTopicCommentDto } from '../../../dto/comment/update-topic-comment.dto';

@Controller('api/v1/admin/comments')
@UseGuards(JwtAuthGuard)
export class AdminCommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  list(@Request() req: { user: { role: string } }) {
    ensureAdmin(req.user.role);
    return this.commentService.listAdmin();
  }

  @Patch(':id')
  update(
    @Request() req: { user: { role: string } },
    @Param('id') commentId: string,
    @Body() dto: UpdateTopicCommentDto,
  ) {
    ensureAdmin(req.user.role);
    return this.commentService.updateAdmin(commentId, dto.text);
  }

  @Delete(':id')
  remove(@Request() req: { user: { role: string } }, @Param('id') commentId: string) {
    ensureAdmin(req.user.role);
    return this.commentService.deleteAdmin(commentId);
  }
}

function ensureAdmin(role: string) {
  if (role !== 'admin') throw new ForbiddenException('Admin only');
}
