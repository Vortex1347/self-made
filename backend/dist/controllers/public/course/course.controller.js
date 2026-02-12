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
exports.CourseController = void 0;
const common_1 = require("@nestjs/common");
const student_jwt_auth_guard_1 = require("../../../common/guards/student-jwt-auth.guard");
const student_service_1 = require("../../../services/student/student.service");
const course_service_1 = require("../../../services/course/course.service");
let CourseController = class CourseController {
    constructor(studentService, courseService) {
        this.studentService = studentService;
        this.courseService = courseService;
    }
    modules(req) {
        this.studentService.requireAccess(req.user);
        return this.courseService.listModules();
    }
    topic(req, topicId) {
        this.studentService.requireAccess(req.user);
        return this.courseService.getTopic(topicId);
    }
};
exports.CourseController = CourseController;
__decorate([
    (0, common_1.Get)('modules'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "modules", null);
__decorate([
    (0, common_1.Get)('topics/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "topic", null);
exports.CourseController = CourseController = __decorate([
    (0, common_1.Controller)('api/public/course'),
    (0, common_1.UseGuards)(student_jwt_auth_guard_1.StudentJwtAuthGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService,
        course_service_1.CourseService])
], CourseController);
//# sourceMappingURL=course.controller.js.map