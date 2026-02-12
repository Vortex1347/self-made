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
exports.CourseTopicEntity = void 0;
const typeorm_1 = require("typeorm");
const course_module_entity_1 = require("./course-module.entity");
const topic_comment_entity_1 = require("./topic-comment.entity");
let CourseTopicEntity = class CourseTopicEntity {
};
exports.CourseTopicEntity = CourseTopicEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CourseTopicEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'module_id', type: 'uuid' }),
    __metadata("design:type", String)
], CourseTopicEntity.prototype, "moduleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_module_entity_1.CourseModuleEntity, (module) => module.topics, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'module_id' }),
    __metadata("design:type", course_module_entity_1.CourseModuleEntity)
], CourseTopicEntity.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CourseTopicEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_index', type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], CourseTopicEntity.prototype, "orderIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content_blocks', type: 'jsonb', default: () => "'[]'::jsonb" }),
    __metadata("design:type", Array)
], CourseTopicEntity.prototype, "contentBlocks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], CourseTopicEntity.prototype, "trainer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_published', default: true }),
    __metadata("design:type", Boolean)
], CourseTopicEntity.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => topic_comment_entity_1.TopicCommentEntity, (comment) => comment.topic),
    __metadata("design:type", Array)
], CourseTopicEntity.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CourseTopicEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CourseTopicEntity.prototype, "updatedAt", void 0);
exports.CourseTopicEntity = CourseTopicEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'course_topic' })
], CourseTopicEntity);
//# sourceMappingURL=course-topic.entity.js.map