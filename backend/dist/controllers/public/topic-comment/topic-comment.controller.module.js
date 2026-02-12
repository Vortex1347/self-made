"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicCommentControllerModule = void 0;
const common_1 = require("@nestjs/common");
const topic_comment_controller_1 = require("./topic-comment.controller");
const student_service_module_1 = require("../../../services/student/student.service.module");
const comment_service_module_1 = require("../../../services/comment/comment.service.module");
let TopicCommentControllerModule = class TopicCommentControllerModule {
};
exports.TopicCommentControllerModule = TopicCommentControllerModule;
exports.TopicCommentControllerModule = TopicCommentControllerModule = __decorate([
    (0, common_1.Module)({
        imports: [student_service_module_1.StudentServiceModule, comment_service_module_1.CommentServiceModule],
        controllers: [topic_comment_controller_1.TopicCommentController],
    })
], TopicCommentControllerModule);
//# sourceMappingURL=topic-comment.controller.module.js.map