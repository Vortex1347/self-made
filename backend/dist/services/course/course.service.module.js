"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseServiceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const course_service_1 = require("./course.service");
const course_module_entity_1 = require("../../entities/course-module.entity");
const course_topic_entity_1 = require("../../entities/course-topic.entity");
let CourseServiceModule = class CourseServiceModule {
};
exports.CourseServiceModule = CourseServiceModule;
exports.CourseServiceModule = CourseServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([course_module_entity_1.CourseModuleEntity, course_topic_entity_1.CourseTopicEntity])],
        providers: [course_service_1.CourseService],
        exports: [course_service_1.CourseService],
    })
], CourseServiceModule);
//# sourceMappingURL=course.service.module.js.map