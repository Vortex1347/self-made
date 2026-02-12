import { Repository } from 'typeorm';
import { TopicCommentEntity } from '../../entities/topic-comment.entity';
import { CourseTopicEntity } from '../../entities/course-topic.entity';
import { StudentEntity } from '../../entities/student.entity';
export declare class CommentService {
    private commentRepo;
    private topicRepo;
    constructor(commentRepo: Repository<TopicCommentEntity>, topicRepo: Repository<CourseTopicEntity>);
    listByTopic(topicId: string): Promise<{
        id: string;
        topicId: string;
        studentId: string;
        authorName: string;
        authorLogin: string;
        text: string;
        editedByAdmin: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(topicId: string, student: StudentEntity, text: string): Promise<{
        id: string;
        topicId: string;
        studentId: string;
        authorName: string;
        authorLogin: string;
        text: string;
        editedByAdmin: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateOwn(commentId: string, studentId: string, text: string): Promise<{
        id: string;
        topicId: string;
        studentId: string;
        authorName: string;
        authorLogin: string;
        text: string;
        editedByAdmin: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteOwn(commentId: string, studentId: string): Promise<{
        ok: boolean;
    }>;
    listAdmin(): Promise<{
        topicTitle: string;
        id: string;
        topicId: string;
        studentId: string;
        authorName: string;
        authorLogin: string;
        text: string;
        editedByAdmin: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateAdmin(commentId: string, text: string): Promise<{
        id: string;
        topicId: string;
        studentId: string;
        authorName: string;
        authorLogin: string;
        text: string;
        editedByAdmin: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteAdmin(commentId: string): Promise<{
        ok: boolean;
    }>;
    private ensureTopicExists;
    private toPublicComment;
}
