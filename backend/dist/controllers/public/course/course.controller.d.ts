import { StudentEntity } from '../../../entities/student.entity';
import { StudentService } from '../../../services/student/student.service';
import { CourseService } from '../../../services/course/course.service';
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
}
