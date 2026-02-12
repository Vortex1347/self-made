import { CommentService } from '../../../services/comment/comment.service';
import { UpdateTopicCommentDto } from '../../../dto/comment/update-topic-comment.dto';
export declare class AdminCommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    list(req: {
        user: {
            role: string;
        };
    }): Promise<{
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
    update(req: {
        user: {
            role: string;
        };
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
    remove(req: {
        user: {
            role: string;
        };
    }, commentId: string): Promise<{
        ok: boolean;
    }>;
}
