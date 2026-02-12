"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentJwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("../../entities/student.entity");
let StudentJwtStrategy = class StudentJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'student-jwt') {
    constructor(studentRepo) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.API_JWT_ACCESS_TOKEN_SECRET || 'change-me',
        });
        this.studentRepo = studentRepo;
    }
    async validate(payload) {
        if (payload.type !== 'student')
            throw new common_1.UnauthorizedException();
        const student = await this.studentRepo.findOne({
            where: { id: payload.sub, login: payload.login, isActive: true },
        });
        if (!student)
            throw new common_1.UnauthorizedException();
        return student;
    }
};
exports.StudentJwtStrategy = StudentJwtStrategy;
exports.StudentJwtStrategy = StudentJwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.StudentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StudentJwtStrategy);
//# sourceMappingURL=student-jwt.strategy.js.map