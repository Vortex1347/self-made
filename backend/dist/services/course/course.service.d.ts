import { Repository } from 'typeorm';
import { CourseModuleEntity } from '../../entities/course-module.entity';
import { CourseTopicEntity } from '../../entities/course-topic.entity';
export declare class CourseService {
    private moduleRepo;
    private topicRepo;
    constructor(moduleRepo: Repository<CourseModuleEntity>, topicRepo: Repository<CourseTopicEntity>);
    listModules(): Promise<{
        id: string;
        title: string;
        orderIndex: number;
        topics: {
            id: string;
            title: string;
            orderIndex: number;
            hasTrainer: boolean;
        }[];
    }[]>;
    getTopic(topicId: string): Promise<{
        id: string;
        title: string;
        orderIndex: number;
        module: {
            id: string;
            title: string;
        };
        contentBlocks: unknown[];
        trainer: unknown;
    }>;
}
