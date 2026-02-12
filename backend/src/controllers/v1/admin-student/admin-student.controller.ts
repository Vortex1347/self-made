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
import { StudentService } from '../../../services/student/student.service';
import { CreateStudentDto } from '../../../dto/student/create-student.dto';
import { UpdateStudentAccessDto } from '../../../dto/student/update-student-access.dto';

@Controller('api/v1/admin/students')
@UseGuards(JwtAuthGuard)
export class AdminStudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  list(@Request() req: { user: { role: string } }) {
    ensureAdmin(req.user.role);
    return this.studentService.listAdmin();
  }

  @Post()
  createOrUpdate(@Request() req: { user: { role: string } }, @Body() dto: CreateStudentDto) {
    ensureAdmin(req.user.role);
    return this.studentService.createOrUpdateAdmin(dto);
  }

  @Patch(':id/access')
  updateAccess(
    @Request() req: { user: { role: string } },
    @Param('id') studentId: string,
    @Body() dto: UpdateStudentAccessDto,
  ) {
    ensureAdmin(req.user.role);
    return this.studentService.updateAccessAdmin(studentId, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { role: string } }, @Param('id') studentId: string) {
    ensureAdmin(req.user.role);
    return this.studentService.deleteAdmin(studentId);
  }
}

function ensureAdmin(role: string) {
  if (role !== 'admin') throw new ForbiddenException('Admin only');
}
