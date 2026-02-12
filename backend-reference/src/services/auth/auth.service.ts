import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminEntity } from '../../entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>,
    private jwtService: JwtService,
  ) {}

  async login(login: string, password: string) {
    const admin = await this.adminRepo.findOne({ where: { login } });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash)))
      throw new UnauthorizedException('Invalid login or password');
    const payload = { sub: admin.id, login: admin.login };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
