import { StudentService } from '../../../services/student/student.service';
import { LoginStudentDto } from '../../../dto/student/login-student.dto';
import { StudentEntity } from '../../../entities/student.entity';
import { ChangeStudentPasswordDto } from '../../../dto/student/change-student-password.dto';
export declare class StudentAuthController {
    private readonly studentService;
    constructor(studentService: StudentService);
    login(dto: LoginStudentDto): Promise<{
        accessToken: string;
        student: {
            id: string;
            name: string;
            login: string;
            accessUntil: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessActive: boolean;
    }>;
    me(req: {
        user: StudentEntity;
    }): {
        student: {
            id: string;
            name: string;
            login: string;
            accessUntil: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessActive: boolean;
    };
    changePassword(req: {
        user: StudentEntity;
    }, dto: ChangeStudentPasswordDto): Promise<{
        ok: boolean;
    }>;
}
