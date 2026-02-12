import { StudentEntity } from '../../../entities/student.entity';
import { StudentService } from '../../../services/student/student.service';
import { CommentService } from '../../../services/comment/comment.service';
import { CreateTopicCommentDto } from '../../../dto/comment/create-topic-comment.dto';
import { UpdateTopicCommentDto } from '../../../dto/comment/update-topic-comment.dto';
export declare class TopicCommentController {
    private readonly studentService;
    private readonly commentService;
    constructor(studentService: StudentService, commentService: CommentService);
    list(req: {
        user: StudentEntity;
    }, topicId: string): Promise<{
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
    create(req: {
        user: StudentEntity;
    }, topicId: string, dto: CreateTopicCommentDto): Promise<{
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
    update(req: {
        user: StudentEntity;
    }, commentId: string, dto: UpdateTopicCommentDto): Promise<{
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
    delete(req: {
        user: StudentEntity;
    }, commentId: string): Promise<{
        ok: boolean;
    }>;
}
