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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const topic_comment_entity_1 = require("../../entities/topic-comment.entity");
const course_topic_entity_1 = require("../../entities/course-topic.entity");
let CommentService = class CommentService {
    constructor(commentRepo, topicRepo) {
        this.commentRepo = commentRepo;
        this.topicRepo = topicRepo;
    }
    async listByTopic(topicId) {
        await this.ensureTopicExists(topicId);
        const comments = await this.commentRepo.find({
            where: { topicId },
            order: { createdAt: 'ASC' },
        });
        return comments.map((comment) => this.toPublicComment(comment));
    }
    async create(topicId, student, text) {
        await this.ensureTopicExists(topicId);
        const entity = this.commentRepo.create({
            topicId,
            studentId: student.id,
            authorName: student.name,
            authorLogin: student.login,
            text: text.trim(),
            editedByAdmin: false,
        });
        const saved = await this.commentRepo.save(entity);
        return this.toPublicComment(saved);
    }
    async updateOwn(commentId, studentId, text) {
        const comment = await this.commentRepo.findOne({ where: { id: commentId } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.studentId !== studentId)
            throw new common_1.ForbiddenException('Forbidden');
        comment.text = text.trim();
        const saved = await this.commentRepo.save(comment);
        return this.toPublicComment(saved);
    }
    async deleteOwn(commentId, studentId) {
        const comment = await this.commentRepo.findOne({ where: { id: commentId } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.studentId !== studentId)
            throw new common_1.ForbiddenException('Forbidden');
        await this.commentRepo.delete({ id: commentId });
        return { ok: true };
    }
    async listAdmin() {
        const comments = await this.commentRepo.find({
            relations: { topic: true },
            order: { createdAt: 'DESC' },
            take: 300,
        });
        return comments.map((comment) => ({
            ...this.toPublicComment(comment),
            topicTitle: comment.topic?.title || '',
        }));
    }
    async updateAdmin(commentId, text) {
        const comment = await this.commentRepo.findOne({ where: { id: commentId } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        comment.text = text.trim();
        comment.editedByAdmin = true;
        const saved = await this.commentRepo.save(comment);
        return this.toPublicComment(saved);
    }
    async deleteAdmin(commentId) {
        const comment = await this.commentRepo.findOne({ where: { id: commentId } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        await this.commentRepo.delete({ id: commentId });
        return { ok: true };
    }
    async ensureTopicExists(topicId) {
        const topic = await this.topicRepo.findOne({ where: { id: topicId, isPublished: true } });
        if (!topic)
            throw new common_1.NotFoundException('Topic not found');
    }
    toPublicComment(comment) {
        return {
            id: comment.id,
            topicId: comment.topicId,
            studentId: comment.studentId,
            authorName: comment.authorName,
            authorLogin: comment.authorLogin,
            text: comment.text,
            editedByAdmin: comment.editedByAdmin,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        };
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(topic_comment_entity_1.TopicCommentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(course_topic_entity_1.CourseTopicEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CommentService);
//# sourceMappingURL=comment.service.js.map