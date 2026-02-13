import { StudentEntity } from '../../../entities/student.entity';
import { StudentService } from '../../../services/student/student.service';
import { CourseService } from '../../../services/course/course.service';
import { SubmitTrainerDto } from '../../../dto/course/submit-trainer.dto';
export declare class CourseController {
    private readonly studentService;
    private readonly courseService;
    constructor(studentService: StudentService, courseService: CourseService);
    modules(req: {
        user: StudentEntity;
    }): Promise<{
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
    topic(req: {
        user: StudentEntity;
    }, topicId: string): Promise<{
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
    trainer(req: {
        user: StudentEntity;
    }, topicId: string): Promise<{
        topicId: string;
        topicTitle: string;
        moduleTitle: string;
        trainer: {};
    }>;
    submitTrainer(req: {
        user: StudentEntity;
    }, topicId: string, dto: SubmitTrainerDto): Promise<{
        ok: boolean;
        topicId: string;
        trainerType: string;
        feedback: string;
        answerAccepted: {} | null;
        checkedAt: string;
    }>;
}
