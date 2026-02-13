import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { StudentEntity } from '../../entities/student.entity';
import { CreateStudentDto } from '../../dto/student/create-student.dto';
import { UpdateStudentAccessDto } from '../../dto/student/update-student-access.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRepo: Repository<StudentEntity>,
    private jwtService: JwtService,
  ) {}

  async listAdmin() {
    const students = await this.studentRepo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    return students.map((student) => this.toPublicStudent(student));
  }

  async createOrUpdateAdmin(dto: CreateStudentDto) {
    const accessUntil = normalizeDate(dto.accessUntil);
    const existing = await this.studentRepo.findOne({ where: { login: dto.login } });

    if (existing && !existing.isActive) {
      existing.isActive = true;
    }

    if (existing) {
      existing.name = dto.name;
      existing.accessUntil = accessUntil;
      if (dto.password) {
        existing.passwordHash = await bcrypt.hash(dto.password, 10);
      }
      const saved = await this.studentRepo.save(existing);
      return this.toPublicStudent(saved);
    }

    if (!dto.password || dto.password.length < 4) {
      throw new BadRequestException('Password required for new student (min 4 characters)');
    }
    const created = this.studentRepo.create({
      name: dto.name,
      login: dto.login,
      accessUntil,
      passwordHash: await bcrypt.hash(dto.password, 10),
      isActive: true,
    });
    const saved = await this.studentRepo.save(created);
    return this.toPublicStudent(saved);
  }

  async updateAccessAdmin(studentId: string, dto: UpdateStudentAccessDto) {
    const student = await this.studentRepo.findOne({ where: { id: studentId, isActive: true } });
    if (!student) throw new NotFoundException('Student not found');
    student.accessUntil = normalizeDate(dto.accessUntil);
    const saved = await this.studentRepo.save(student);
    return this.toPublicStudent(saved);
  }

  async deleteAdmin(studentId: string) {
    const student = await this.studentRepo.findOne({ where: { id: studentId, isActive: true } });
    if (!student) throw new NotFoundException('Student not found');
    student.isActive = false;
    await this.studentRepo.save(student);
    return { ok: true };
  }

  async loginStudent(login: string, password: string) {
    const student = await this.studentRepo.findOne({ where: { login, isActive: true } });
    if (!student || !(await bcrypt.compare(password, student.passwordHash))) {
      throw new UnauthorizedException('Invalid login or password');
    }
    const payload = { sub: student.id, login: student.login, role: 'student', type: 'student' };
    return {
      accessToken: this.jwtService.sign(payload),
      student: this.toPublicStudent(student),
      accessActive: isAccessActive(student.accessUntil),
    };
  }

  async changePasswordStudent(studentId: string, currentPassword: string, newPassword: string) {
    const student = await this.studentRepo.findOne({ where: { id: studentId, isActive: true } });
    if (!student) throw new NotFoundException('Student not found');

    const currentOk = await bcrypt.compare(currentPassword, student.passwordHash);
    if (!currentOk) throw new UnauthorizedException('Current password is incorrect');

    student.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.studentRepo.save(student);
    return { ok: true };
  }

  getStudentState(student: StudentEntity) {
    return {
      student: this.toPublicStudent(student),
      accessActive: isAccessActive(student.accessUntil),
    };
  }

  requireAccess(student: StudentEntity) {
    if (!isAccessActive(student.accessUntil)) {
      throw new ForbiddenException('Subscription expired');
    }
  }

  async getByIdOrThrow(studentId: string) {
    const student = await this.studentRepo.findOne({ where: { id: studentId, isActive: true } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  private toPublicStudent(student: StudentEntity) {
    return {
      id: student.id,
      name: student.name,
      login: student.login,
      accessUntil: student.accessUntil,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };
  }
}

function normalizeDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException('Invalid date');
  }
  return date.toISOString().slice(0, 10);
}

function isAccessActive(accessUntil: string) {
  const now = new Date().toISOString().slice(0, 10);
  return accessUntil >= now;
}
