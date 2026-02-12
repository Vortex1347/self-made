import { CourseTopicEntity } from './course-topic.entity';
export declare class CourseModuleEntity {
    id: string;
    title: string;
    orderIndex: number;
    isPublished: boolean;
    topics: CourseTopicEntity[];
    createdAt: Date;
    updatedAt: Date;
}
