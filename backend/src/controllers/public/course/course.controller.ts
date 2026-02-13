import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { StudentJwtAuthGuard } from '../../../common/guards/student-jwt-auth.guard';
import { StudentEntity } from '../../../entities/student.entity';
import { StudentService } from '../../../services/student/student.service';
import { CourseService } from '../../../services/course/course.service';
import { SubmitTrainerDto } from '../../../dto/course/submit-trainer.dto';

@Controller('api/public/course')
@UseGuards(StudentJwtAuthGuard)
export class CourseController {
  constructor(
    private readonly studentService: StudentService,
    private readonly courseService: CourseService,
  ) {}

  @Get('modules')
  modules(@Request() req: { user: StudentEntity }) {
    this.studentService.requireAccess(req.user);
    return this.courseService.listModules();
  }

  @Get('topics/:id')
  topic(@Request() req: { user: StudentEntity }, @Param('id') topicId: string) {
    this.studentService.requireAccess(req.user);
    return this.courseService.getTopic(topicId);
  }

  @Get('topics/:id/trainer')
  trainer(@Request() req: { user: StudentEntity }, @Param('id') topicId: string) {
    this.studentService.requireAccess(req.user);
    return this.courseService.getTrainer(topicId);
  }

  @Post('topics/:id/trainer/submit')
  submitTrainer(
    @Request() req: { user: StudentEntity },
    @Param('id') topicId: string,
    @Body() dto: SubmitTrainerDto,
  ) {
    this.studentService.requireAccess(req.user);
    return this.courseService.submitTrainer(topicId, dto);
  }
}
