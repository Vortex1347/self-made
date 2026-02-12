"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const throttler_1 = require("@nestjs/throttler");
const app_config_module_1 = require("./infrastructure/app-config/app-config.module");
const db_module_1 = require("./infrastructure/db/db.module");
const auth_controller_module_1 = require("./controllers/v1/auth/auth.controller.module");
const health_controller_module_1 = require("./controllers/v1/health/health.controller.module");
const student_auth_controller_module_1 = require("./controllers/public/student-auth/student-auth.controller.module");
const course_controller_module_1 = require("./controllers/public/course/course.controller.module");
const topic_comment_controller_module_1 = require("./controllers/public/topic-comment/topic-comment.controller.module");
const admin_student_controller_module_1 = require("./controllers/v1/admin-student/admin-student.controller.module");
const admin_comment_controller_module_1 = require("./controllers/v1/admin-comment/admin-comment.controller.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: parseInt(process.env.API_RATE_LIMIT_TTL || '60000', 10),
                    limit: parseInt(process.env.API_RATE_LIMIT_LIMIT || '120', 10),
                },
            ]),
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.API_JWT_ACCESS_TOKEN_SECRET,
                signOptions: { expiresIn: process.env.API_JWT_ACCESS_TOKEN_EXPIRATION || '8h' },
            }),
            app_config_module_1.AppConfigModule,
            db_module_1.DbModule,
            auth_controller_module_1.AuthControllerModule,
            health_controller_module_1.HealthControllerModule,
            student_auth_controller_module_1.StudentAuthControllerModule,
            course_controller_module_1.CourseControllerModule,
            topic_comment_controller_module_1.TopicCommentControllerModule,
            admin_student_controller_module_1.AdminStudentControllerModule,
            admin_comment_controller_module_1.AdminCommentControllerModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map