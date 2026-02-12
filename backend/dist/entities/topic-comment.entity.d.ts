import { CourseTopicEntity } from './course-topic.entity';
import { StudentEntity } from './student.entity';
export declare class TopicCommentEntity {
    id: string;
    topicId: string;
    topic: CourseTopicEntity;
    studentId: string;
    student: StudentEntity;
    authorName: string;
    authorLogin: string;
    text: string;
    editedByAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}
