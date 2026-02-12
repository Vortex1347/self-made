"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseControllerModule = void 0;
const common_1 = require("@nestjs/common");
const course_controller_1 = require("./course.controller");
const student_service_module_1 = require("../../../services/student/student.service.module");
const course_service_module_1 = require("../../../services/course/course.service.module");
let CourseControllerModule = class CourseControllerModule {
};
exports.CourseControllerModule = CourseControllerModule;
exports.CourseControllerModule = CourseControllerModule = __decorate([
    (0, common_1.Module)({
        imports: [student_service_module_1.StudentServiceModule, course_service_module_1.CourseServiceModule],
        controllers: [course_controller_1.CourseController],
    })
], CourseControllerModule);
//# sourceMappingURL=course.controller.module.js.map