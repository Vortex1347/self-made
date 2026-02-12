import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from '../../../services/auth/auth.service';
import { LoginDto } from '../../../dto/auth/login.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.login, dto.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req: { user: { id: string; login: string; role: string } }) {
    return { id: req.user.id, login: req.user.login, role: req.user.role };
  }
}
