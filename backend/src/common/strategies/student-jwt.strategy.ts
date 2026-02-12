import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEntity } from '../../entities/student.entity';

@Injectable()
export class StudentJwtStrategy extends PassportStrategy(Strategy, 'student-jwt') {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRepo: Repository<StudentEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.API_JWT_ACCESS_TOKEN_SECRET || 'change-me',
    });
  }

  async validate(payload: { sub: string; login: string; type: string }) {
    if (payload.type !== 'student') throw new UnauthorizedException();
    const student = await this.studentRepo.findOne({
      where: { id: payload.sub, login: payload.login, isActive: true },
    });
    if (!student) throw new UnauthorizedException();
    return student;
  }
}
