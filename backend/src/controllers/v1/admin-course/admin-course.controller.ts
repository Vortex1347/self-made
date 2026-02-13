import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CourseService } from '../../../services/course/course.service';
import { AdminUpsertTopicDto } from '../../../dto/course/admin-upsert-topic.dto';
import { AdminUpsertModuleDto } from '../../../dto/course/admin-upsert-module.dto';

@Controller('api/v1/admin/course')
@UseGuards(JwtAuthGuard)
export class AdminCourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('modules')
  listModules(@Request() req: { user: { role: string } }) {
    ensureAdmin(req.user.role);
    return this.courseService.listModulesAdmin();
  }

  @Post('modules')
  createModule(@Request() req: { user: { role: string } }, @Body() dto: AdminUpsertModuleDto) {
    ensureAdmin(req.user.role);
    return this.courseService.createModuleAdmin(dto);
  }

  @Patch('modules/:id')
  updateModule(
    @Request() req: { user: { role: string } },
    @Param('id') moduleId: string,
    @Body() dto: AdminUpsertModuleDto,
  ) {
    ensureAdmin(req.user.role);
    return this.courseService.updateModuleAdmin(moduleId, dto);
  }

  @Delete('modules/:id')
  deleteModule(@Request() req: { user: { role: string } }, @Param('id') moduleId: string) {
    ensureAdmin(req.user.role);
    return this.courseService.deleteModuleAdmin(moduleId);
  }

  @Get('topics')
  listTopics(@Request() req: { user: { role: string } }) {
    ensureAdmin(req.user.role);
    return this.courseService.listTopicsAdmin();
  }

  @Post('topics')
  createTopic(@Request() req: { user: { role: string } }, @Body() dto: AdminUpsertTopicDto) {
    ensureAdmin(req.user.role);
    return this.courseService.createTopicAdmin(dto);
  }

  @Patch('topics/:id')
  updateTopic(
    @Request() req: { user: { role: string } },
    @Param('id') topicId: string,
    @Body() dto: AdminUpsertTopicDto,
  ) {
    ensureAdmin(req.user.role);
    return this.courseService.updateTopicAdmin(topicId, dto);
  }

  @Delete('topics/:id')
  deleteTopic(@Request() req: { user: { role: string } }, @Param('id') topicId: string) {
    ensureAdmin(req.user.role);
    return this.courseService.deleteTopicAdmin(topicId);
  }
}

function ensureAdmin(role: string) {
  if (role !== 'admin') throw new ForbiddenException('Admin only');
}
