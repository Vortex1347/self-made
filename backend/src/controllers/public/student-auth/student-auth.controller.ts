import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { StudentService } from '../../../services/student/student.service';
import { LoginStudentDto } from '../../../dto/student/login-student.dto';
import { StudentJwtAuthGuard } from '../../../common/guards/student-jwt-auth.guard';
import { StudentEntity } from '../../../entities/student.entity';

@Controller('api/public/student-auth')
export class StudentAuthController {
  constructor(private readonly studentService: StudentService) {}

  @Post('login')
  login(@Body() dto: LoginStudentDto) {
    return this.studentService.loginStudent(dto.login, dto.password);
  }

  @Get('me')
  @UseGuards(StudentJwtAuthGuard)
  me(@Request() req: { user: StudentEntity }) {
    return this.studentService.getStudentState(req.user);
  }
}
