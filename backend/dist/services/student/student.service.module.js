"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentServiceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const student_entity_1 = require("../../entities/student.entity");
const student_service_1 = require("./student.service");
const student_jwt_strategy_1 = require("../../common/strategies/student-jwt.strategy");
let StudentServiceModule = class StudentServiceModule {
};
exports.StudentServiceModule = StudentServiceModule;
exports.StudentServiceModule = StudentServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([student_entity_1.StudentEntity]),
            jwt_1.JwtModule.register({
                secret: process.env.API_JWT_ACCESS_TOKEN_SECRET,
                signOptions: { expiresIn: process.env.API_JWT_ACCESS_TOKEN_EXPIRATION || '8h' },
            }),
        ],
        providers: [student_service_1.StudentService, student_jwt_strategy_1.StudentJwtStrategy],
        exports: [student_service_1.StudentService],
    })
], StudentServiceModule);
//# sourceMappingURL=student.service.module.js.map