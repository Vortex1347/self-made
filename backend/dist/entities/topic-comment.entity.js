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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicCommentEntity = void 0;
const typeorm_1 = require("typeorm");
const course_topic_entity_1 = require("./course-topic.entity");
const student_entity_1 = require("./student.entity");
let TopicCommentEntity = class TopicCommentEntity {
};
exports.TopicCommentEntity = TopicCommentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TopicCommentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'topic_id', type: 'uuid' }),
    __metadata("design:type", String)
], TopicCommentEntity.prototype, "topicId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_topic_entity_1.CourseTopicEntity, (topic) => topic.comments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'topic_id' }),
    __metadata("design:type", course_topic_entity_1.CourseTopicEntity)
], TopicCommentEntity.prototype, "topic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id', type: 'uuid' }),
    __metadata("design:type", String)
], TopicCommentEntity.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.StudentEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.StudentEntity)
], TopicCommentEntity.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'author_name' }),
    __metadata("design:type", String)
], TopicCommentEntity.prototype, "authorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'author_login' }),
    __metadata("design:type", String)
], TopicCommentEntity.prototype, "authorLogin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], TopicCommentEntity.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'edited_by_admin', default: false }),
    __metadata("design:type", Boolean)
], TopicCommentEntity.prototype, "editedByAdmin", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TopicCommentEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TopicCommentEntity.prototype, "updatedAt", void 0);
exports.TopicCommentEntity = TopicCommentEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'topic_comment' })
], TopicCommentEntity);
//# sourceMappingURL=topic-comment.entity.js.map