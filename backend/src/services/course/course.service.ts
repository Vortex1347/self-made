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
}
