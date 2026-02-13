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
    listModulesAdmin(): Promise<{
        id: string;
        title: string;
        orderIndex: number;
        isPublished: boolean;
    }[]>;
    createModuleAdmin(payload: {
        title: string;
        orderIndex?: number;
        isPublished?: boolean;
    }): Promise<{
        id: string;
        title: string;
        orderIndex: number;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateModuleAdmin(moduleId: string, payload: {
        title: string;
        orderIndex?: number;
        isPublished?: boolean;
    }): Promise<{
        id: string;
        title: string;
        orderIndex: number;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteModuleAdmin(moduleId: string): Promise<{
        ok: boolean;
    }>;
    listTopicsAdmin(): Promise<{
        id: string;
        moduleId: string;
        moduleTitle: string;
        title: string;
        orderIndex: number;
        contentBlocks: unknown[];
        trainer: unknown;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createTopicAdmin(payload: {
        moduleId: string;
        title: string;
        orderIndex?: number;
        contentBlocks?: unknown[];
        trainer?: unknown | null;
        isPublished?: boolean;
    }): Promise<{
        id: string;
        moduleId: string;
        moduleTitle: string;
        title: string;
        orderIndex: number;
        contentBlocks: unknown[];
        trainer: unknown;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTopicAdmin(topicId: string, payload: {
        moduleId: string;
        title: string;
        orderIndex?: number;
        contentBlocks?: unknown[];
        trainer?: unknown | null;
        isPublished?: boolean;
    }): Promise<{
        id: string;
        moduleId: string;
        moduleTitle: string;
        title: string;
        orderIndex: number;
        contentBlocks: unknown[];
        trainer: unknown;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteTopicAdmin(topicId: string): Promise<{
        ok: boolean;
    }>;
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
    private getTopicAdmin;
    private getModuleAdmin;
    getTrainer(topicId: string): Promise<{
        topicId: string;
        topicTitle: string;
        moduleTitle: string;
        trainer: {};
    }>;
    submitTrainer(topicId: string, payload: {
        type: string;
        answer?: unknown;
    }): Promise<{
        ok: boolean;
        topicId: string;
        trainerType: string;
        feedback: string;
        answerAccepted: {} | null;
        checkedAt: string;
    }>;
    private getTrainerFeedback;
    private ensureModuleExists;
}
