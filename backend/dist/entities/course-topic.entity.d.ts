import { CourseModuleEntity } from './course-module.entity';
import { TopicCommentEntity } from './topic-comment.entity';
export declare class CourseTopicEntity {
    id: string;
    moduleId: string;
    module: CourseModuleEntity;
    title: string;
    orderIndex: number;
    contentBlocks: unknown[];
    trainer: unknown | null;
    isPublished: boolean;
    comments: TopicCommentEntity[];
    createdAt: Date;
    updatedAt: Date;
}
