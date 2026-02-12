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
exports.AdminStudentController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const student_service_1 = require("../../../services/student/student.service");
const create_student_dto_1 = require("../../../dto/student/create-student.dto");
const update_student_access_dto_1 = require("../../../dto/student/update-student-access.dto");
let AdminStudentController = class AdminStudentController {
    constructor(studentService) {
        this.studentService = studentService;
    }
    list(req) {
        ensureAdmin(req.user.role);
        return this.studentService.listAdmin();
    }
    createOrUpdate(req, dto) {
        ensureAdmin(req.user.role);
        return this.studentService.createOrUpdateAdmin(dto);
    }
    updateAccess(req, studentId, dto) {
        ensureAdmin(req.user.role);
        return this.studentService.updateAccessAdmin(studentId, dto);
    }
    remove(req, studentId) {
        ensureAdmin(req.user.role);
        return this.studentService.deleteAdmin(studentId);
    }
};
exports.AdminStudentController = AdminStudentController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminStudentController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", void 0)
], AdminStudentController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.Patch)(':id/access'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_student_access_dto_1.UpdateStudentAccessDto]),
    __metadata("design:returntype", void 0)
], AdminStudentController.prototype, "updateAccess", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminStudentController.prototype, "remove", null);
exports.AdminStudentController = AdminStudentController = __decorate([
    (0, common_1.Controller)('api/v1/admin/students'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], AdminStudentController);
function ensureAdmin(role) {
    if (role !== 'admin')
        throw new common_1.ForbiddenException('Admin only');
}
//# sourceMappingURL=admin-student.controller.js.map