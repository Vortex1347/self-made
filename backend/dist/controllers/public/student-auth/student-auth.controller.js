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
exports.StudentAuthController = void 0;
const common_1 = require("@nestjs/common");
const student_service_1 = require("../../../services/student/student.service");
const login_student_dto_1 = require("../../../dto/student/login-student.dto");
const student_jwt_auth_guard_1 = require("../../../common/guards/student-jwt-auth.guard");
let StudentAuthController = class StudentAuthController {
    constructor(studentService) {
        this.studentService = studentService;
    }
    login(dto) {
        return this.studentService.loginStudent(dto.login, dto.password);
    }
    me(req) {
        return this.studentService.getStudentState(req.user);
    }
};
exports.StudentAuthController = StudentAuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_student_dto_1.LoginStudentDto]),
    __metadata("design:returntype", void 0)
], StudentAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(student_jwt_auth_guard_1.StudentJwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentAuthController.prototype, "me", null);
exports.StudentAuthController = StudentAuthController = __decorate([
    (0, common_1.Controller)('api/public/student-auth'),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentAuthController);
//# sourceMappingURL=student-auth.controller.js.map