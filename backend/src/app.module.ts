import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppConfigModule } from './infrastructure/app-config/app-config.module';
import { DbModule } from './infrastructure/db/db.module';
import { AuthControllerModule } from './controllers/v1/auth/auth.controller.module';
import { HealthControllerModule } from './controllers/v1/health/health.controller.module';
import { StudentAuthControllerModule } from './controllers/public/student-auth/student-auth.controller.module';
import { CourseControllerModule } from './controllers/public/course/course.controller.module';
import { TopicCommentControllerModule } from './controllers/public/topic-comment/topic-comment.controller.module';
import { AdminStudentControllerModule } from './controllers/v1/admin-student/admin-student.controller.module';
import { AdminCommentControllerModule } from './controllers/v1/admin-comment/admin-comment.controller.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.API_RATE_LIMIT_TTL || '60000', 10),
        limit: parseInt(process.env.API_RATE_LIMIT_LIMIT || '120', 10),
      },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.API_JWT_ACCESS_TOKEN_SECRET as string,
      signOptions: { expiresIn: process.env.API_JWT_ACCESS_TOKEN_EXPIRATION || '8h' },
    }),
    AppConfigModule,
    DbModule,
    AuthControllerModule,
    HealthControllerModule,
    StudentAuthControllerModule,
    CourseControllerModule,
    TopicCommentControllerModule,
    AdminStudentControllerModule,
    AdminCommentControllerModule,
  ],
})
export class AppModule {}
