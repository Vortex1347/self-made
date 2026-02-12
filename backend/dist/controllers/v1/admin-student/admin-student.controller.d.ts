import { StudentService } from '../../../services/student/student.service';
import { CreateStudentDto } from '../../../dto/student/create-student.dto';
import { UpdateStudentAccessDto } from '../../../dto/student/update-student-access.dto';
export declare class AdminStudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    list(req: {
        user: {
            role: string;
        };
    }): Promise<{
        id: string;
        name: string;
        login: string;
        accessUntil: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createOrUpdate(req: {
        user: {
            role: string;
        };
    }, dto: CreateStudentDto): Promise<{
        id: string;
        name: string;
        login: string;
        accessUntil: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAccess(req: {
        user: {
            role: string;
        };
    }, studentId: string, dto: UpdateStudentAccessDto): Promise<{
        id: string;
        name: string;
        login: string;
        accessUntil: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(req: {
        user: {
            role: string;
        };
    }, studentId: string): Promise<{
        ok: boolean;
    }>;
}
