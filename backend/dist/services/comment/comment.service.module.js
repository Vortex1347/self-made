"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentServiceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const comment_service_1 = require("./comment.service");
const topic_comment_entity_1 = require("../../entities/topic-comment.entity");
const course_topic_entity_1 = require("../../entities/course-topic.entity");
let CommentServiceModule = class CommentServiceModule {
};
exports.CommentServiceModule = CommentServiceModule;
exports.CommentServiceModule = CommentServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([topic_comment_entity_1.TopicCommentEntity, course_topic_entity_1.CourseTopicEntity])],
        providers: [comment_service_1.CommentService],
        exports: [comment_service_1.CommentService],
    })
], CommentServiceModule);
//# sourceMappingURL=comment.service.module.js.map