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
exports.TopicCommentController = void 0;
const common_1 = require("@nestjs/common");
const student_jwt_auth_guard_1 = require("../../../common/guards/student-jwt-auth.guard");
const student_service_1 = require("../../../services/student/student.service");
const comment_service_1 = require("../../../services/comment/comment.service");
const create_topic_comment_dto_1 = require("../../../dto/comment/create-topic-comment.dto");
const update_topic_comment_dto_1 = require("../../../dto/comment/update-topic-comment.dto");
let TopicCommentController = class TopicCommentController {
    constructor(studentService, commentService) {
        this.studentService = studentService;
        this.commentService = commentService;
    }
    list(req, topicId) {
        this.studentService.requireAccess(req.user);
        return this.commentService.listByTopic(topicId);
    }
    create(req, topicId, dto) {
        this.studentService.requireAccess(req.user);
        return this.commentService.create(topicId, req.user, dto.text);
    }
    update(req, commentId, dto) {
        this.studentService.requireAccess(req.user);
        return this.commentService.updateOwn(commentId, req.user.id, dto.text);
    }
    delete(req, commentId) {
        this.studentService.requireAccess(req.user);
        return this.commentService.deleteOwn(commentId, req.user.id);
    }
};
exports.TopicCommentController = TopicCommentController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('topicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TopicCommentController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('topicId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_topic_comment_dto_1.CreateTopicCommentDto]),
    __metadata("design:returntype", void 0)
], TopicCommentController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_topic_comment_dto_1.UpdateTopicCommentDto]),
    __metadata("design:returntype", void 0)
], TopicCommentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TopicCommentController.prototype, "delete", null);
exports.TopicCommentController = TopicCommentController = __decorate([
    (0, common_1.Controller)('api/public/topics/:topicId/comments'),
    (0, common_1.UseGuards)(student_jwt_auth_guard_1.StudentJwtAuthGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService,
        comment_service_1.CommentService])
], TopicCommentController);
//# sourceMappingURL=topic-comment.controller.js.map