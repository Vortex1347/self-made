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
    async listModulesAdmin() {
        const modules = await this.moduleRepo.find({
            order: { orderIndex: 'ASC', createdAt: 'ASC' },
        });
        return modules.map((moduleItem) => ({
            id: moduleItem.id,
            title: moduleItem.title,
            orderIndex: moduleItem.orderIndex,
            isPublished: moduleItem.isPublished,
        }));
    }
    async createModuleAdmin(payload) {
        const created = this.moduleRepo.create({
            title: payload.title,
            orderIndex: payload.orderIndex ?? 0,
            isPublished: payload.isPublished ?? true,
        });
        const saved = await this.moduleRepo.save(created);
        return this.getModuleAdmin(saved.id);
    }
    async updateModuleAdmin(moduleId, payload) {
        const moduleItem = await this.moduleRepo.findOne({ where: { id: moduleId } });
        if (!moduleItem)
            throw new common_1.NotFoundException('Module not found');
        moduleItem.title = payload.title;
        moduleItem.orderIndex = payload.orderIndex ?? 0;
        moduleItem.isPublished = payload.isPublished ?? true;
        await this.moduleRepo.save(moduleItem);
        return this.getModuleAdmin(moduleItem.id);
    }
    async deleteModuleAdmin(moduleId) {
        const moduleItem = await this.moduleRepo.findOne({ where: { id: moduleId } });
        if (!moduleItem)
            throw new common_1.NotFoundException('Module not found');
        await this.moduleRepo.remove(moduleItem);
        return { ok: true };
    }
    async listTopicsAdmin() {
        const topics = await this.topicRepo.find({
            relations: { module: true },
            order: { orderIndex: 'ASC', createdAt: 'ASC' },
        });
        return topics
            .sort((a, b) => {
            if (a.module.orderIndex !== b.module.orderIndex) {
                return a.module.orderIndex - b.module.orderIndex;
            }
            return a.orderIndex - b.orderIndex;
        })
            .map((topic) => ({
            id: topic.id,
            moduleId: topic.moduleId,
            moduleTitle: topic.module.title,
            title: topic.title,
            orderIndex: topic.orderIndex,
            contentBlocks: topic.contentBlocks,
            trainer: topic.trainer,
            isPublished: topic.isPublished,
            createdAt: topic.createdAt,
            updatedAt: topic.updatedAt,
        }));
    }
    async createTopicAdmin(payload) {
        await this.ensureModuleExists(payload.moduleId);
        const created = this.topicRepo.create({
            moduleId: payload.moduleId,
            title: payload.title,
            orderIndex: payload.orderIndex ?? 0,
            contentBlocks: payload.contentBlocks ?? [],
            trainer: payload.trainer ?? null,
            isPublished: payload.isPublished ?? true,
        });
        const saved = await this.topicRepo.save(created);
        return this.getTopicAdmin(saved.id);
    }
    async updateTopicAdmin(topicId, payload) {
        const topic = await this.topicRepo.findOne({ where: { id: topicId } });
        if (!topic)
            throw new common_1.NotFoundException('Topic not found');
        await this.ensureModuleExists(payload.moduleId);
        topic.moduleId = payload.moduleId;
        topic.title = payload.title;
        topic.orderIndex = payload.orderIndex ?? 0;
        topic.contentBlocks = payload.contentBlocks ?? [];
        topic.trainer = payload.trainer ?? null;
        topic.isPublished = payload.isPublished ?? true;
        await this.topicRepo.save(topic);
        return this.getTopicAdmin(topic.id);
    }
    async deleteTopicAdmin(topicId) {
        const topic = await this.topicRepo.findOne({ where: { id: topicId } });
        if (!topic)
            throw new common_1.NotFoundException('Topic not found');
        await this.topicRepo.remove(topic);
        return { ok: true };
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
    async getTopicAdmin(topicId) {
        const topic = await this.topicRepo.findOne({
            where: { id: topicId },
            relations: { module: true },
        });
        if (!topic)
            throw new common_1.NotFoundException('Topic not found');
        return {
            id: topic.id,
            moduleId: topic.moduleId,
            moduleTitle: topic.module.title,
            title: topic.title,
            orderIndex: topic.orderIndex,
            contentBlocks: topic.contentBlocks,
            trainer: topic.trainer,
            isPublished: topic.isPublished,
            createdAt: topic.createdAt,
            updatedAt: topic.updatedAt,
        };
    }
    async getModuleAdmin(moduleId) {
        const moduleItem = await this.moduleRepo.findOne({ where: { id: moduleId } });
        if (!moduleItem)
            throw new common_1.NotFoundException('Module not found');
        return {
            id: moduleItem.id,
            title: moduleItem.title,
            orderIndex: moduleItem.orderIndex,
            isPublished: moduleItem.isPublished,
            createdAt: moduleItem.createdAt,
            updatedAt: moduleItem.updatedAt,
        };
    }
    async getTrainer(topicId) {
        const topic = await this.topicRepo.findOne({
            where: { id: topicId, isPublished: true },
            relations: { module: true },
        });
        if (!topic)
            throw new common_1.NotFoundException('Topic not found');
        if (!topic.trainer)
            throw new common_1.NotFoundException('Trainer is not configured for this topic');
        return {
            topicId: topic.id,
            topicTitle: topic.title,
            moduleTitle: topic.module.title,
            trainer: topic.trainer,
        };
    }
    async submitTrainer(topicId, payload) {
        const trainerData = await this.getTrainer(topicId);
        const trainer = trainerData.trainer;
        const effectiveType = payload.type || trainer.type || 'unknown';
        return {
            ok: true,
            topicId,
            trainerType: effectiveType,
            feedback: this.getTrainerFeedback(effectiveType),
            answerAccepted: payload.answer ?? null,
            checkedAt: new Date().toISOString(),
        };
    }
    getTrainerFeedback(type) {
        if (type === 'case-builder') {
            return 'Проверь покрытие позитивных и негативных сценариев.';
        }
        if (type === 'api-check') {
            return 'Сверь статус-коды, схему ответа и граничные кейсы.';
        }
        if (type === 'sql') {
            return 'Проверь корректность выборки и фильтрации результатов.';
        }
        return 'Тренажер принят. Добавь критерии проверки для этого типа.';
    }
    async ensureModuleExists(moduleId) {
        const moduleItem = await this.moduleRepo.findOne({ where: { id: moduleId } });
        if (!moduleItem)
            throw new common_1.NotFoundException('Module not found');
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