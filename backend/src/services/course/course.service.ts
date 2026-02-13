import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseModuleEntity } from '../../entities/course-module.entity';
import { CourseTopicEntity } from '../../entities/course-topic.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseModuleEntity)
    private moduleRepo: Repository<CourseModuleEntity>,
    @InjectRepository(CourseTopicEntity)
    private topicRepo: Repository<CourseTopicEntity>,
  ) {}

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

  async createModuleAdmin(payload: { title: string; orderIndex?: number; isPublished?: boolean }) {
    const created = this.moduleRepo.create({
      title: payload.title,
      orderIndex: payload.orderIndex ?? 0,
      isPublished: payload.isPublished ?? true,
    });

    const saved = await this.moduleRepo.save(created);
    return this.getModuleAdmin(saved.id);
  }

  async updateModuleAdmin(moduleId: string, payload: { title: string; orderIndex?: number; isPublished?: boolean }) {
    const moduleItem = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!moduleItem) throw new NotFoundException('Module not found');

    moduleItem.title = payload.title;
    moduleItem.orderIndex = payload.orderIndex ?? 0;
    moduleItem.isPublished = payload.isPublished ?? true;

    await this.moduleRepo.save(moduleItem);
    return this.getModuleAdmin(moduleItem.id);
  }

  async deleteModuleAdmin(moduleId: string) {
    const moduleItem = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!moduleItem) throw new NotFoundException('Module not found');

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

  async createTopicAdmin(payload: {
    moduleId: string;
    title: string;
    orderIndex?: number;
    contentBlocks?: unknown[];
    trainer?: unknown | null;
    isPublished?: boolean;
  }) {
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

  async updateTopicAdmin(
    topicId: string,
    payload: {
      moduleId: string;
      title: string;
      orderIndex?: number;
      contentBlocks?: unknown[];
      trainer?: unknown | null;
      isPublished?: boolean;
    },
  ) {
    const topic = await this.topicRepo.findOne({ where: { id: topicId } });
    if (!topic) throw new NotFoundException('Topic not found');

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

  async deleteTopicAdmin(topicId: string) {
    const topic = await this.topicRepo.findOne({ where: { id: topicId } });
    if (!topic) throw new NotFoundException('Topic not found');

    await this.topicRepo.remove(topic);
    return { ok: true };
  }

  async getTopic(topicId: string) {
    const topic = await this.topicRepo.findOne({
      where: { id: topicId, isPublished: true },
      relations: { module: true },
    });
    if (!topic) throw new NotFoundException('Topic not found');
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

  private async getTopicAdmin(topicId: string) {
    const topic = await this.topicRepo.findOne({
      where: { id: topicId },
      relations: { module: true },
    });
    if (!topic) throw new NotFoundException('Topic not found');

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

  private async getModuleAdmin(moduleId: string) {
    const moduleItem = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!moduleItem) throw new NotFoundException('Module not found');

    return {
      id: moduleItem.id,
      title: moduleItem.title,
      orderIndex: moduleItem.orderIndex,
      isPublished: moduleItem.isPublished,
      createdAt: moduleItem.createdAt,
      updatedAt: moduleItem.updatedAt,
    };
  }

  async getTrainer(topicId: string) {
    const topic = await this.topicRepo.findOne({
      where: { id: topicId, isPublished: true },
      relations: { module: true },
    });
    if (!topic) throw new NotFoundException('Topic not found');
    if (!topic.trainer) throw new NotFoundException('Trainer is not configured for this topic');

    return {
      topicId: topic.id,
      topicTitle: topic.title,
      moduleTitle: topic.module.title,
      trainer: topic.trainer,
    };
  }

  async submitTrainer(topicId: string, payload: { type: string; answer?: unknown }) {
    const trainerData = await this.getTrainer(topicId);
    const trainer = trainerData.trainer as { type?: string };
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

  private getTrainerFeedback(type: string) {
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

  private async ensureModuleExists(moduleId: string) {
    const moduleItem = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!moduleItem) throw new NotFoundException('Module not found');
  }
}
