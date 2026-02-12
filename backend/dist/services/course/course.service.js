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
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const course_module_entity_1 = require("../../entities/course-module.entity");
const course_topic_entity_1 = require("../../entities/course-topic.entity");
let CourseService = class CourseService {
    constructor(moduleRepo, topicRepo) {
        this.moduleRepo = moduleRepo;
        this.topicRepo = topicRepo;
    }
    async listModules() {
        const modules = await this.moduleRepo.find({
            where: { isPublished: true },
            order: { orderIndex: 'ASC' },
        });
        const topics = await this.topicRepo.find({
            where: { isPublished: true },
            order: { orderIndex: 'ASC' },
        });
        return modules.map((moduleItem) => ({
            id: moduleItem.id,
            title: moduleItem.title,
            orderIndex: moduleItem.orderIndex,
            topics: topics
                .filter((topic) => topic.moduleId === moduleItem.id)
                .map((topic) => ({
                id: topic.id,
                title: topic.title,
                orderIndex: topic.orderIndex,
                hasTrainer: !!topic.trainer,
            })),
        }));
    }
    async getTopic(topicId) {
        const topic = await this.topicRepo.findOne({
            where: { id: topicId, isPublished: true },
            relations: { module: true },
        });
        if (!topic)
            throw new common_1.NotFoundException('Topic not found');
        return {
            id: topic.id,
            title: topic.title,
            orderIndex: topic.orderIndex,
            module: {
                id: topic.module.id,
                title: topic.module.title,
            },
            contentBlocks: topic.contentBlocks,
            trainer: topic.trainer,
        };
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_module_entity_1.CourseModuleEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(course_topic_entity_1.CourseTopicEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CourseService);
//# sourceMappingURL=course.service.js.map