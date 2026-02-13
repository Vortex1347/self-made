import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { StudentEntity } from '../../entities/student.entity';
import { CreateStudentDto } from '../../dto/student/create-student.dto';
import { UpdateStudentAccessDto } from '../../dto/student/update-student-access.dto';
export declare class StudentService {
    private studentRepo;
    private jwtService;
    constructor(studentRepo: Repository<StudentEntity>, jwtService: JwtService);
    listAdmin(): Promise<{
        id: string;
        name: string;
        login: string;
        accessUntil: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createOrUpdateAdmin(dto: CreateStudentDto): Promise<{
        id: string;
        name: string;
        login: string;
        accessUntil: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAccessAdmin(studentId: string, dto: UpdateStudentAccessDto): Promise<{
        id: string;
        name: string;
        login: string;
        accessUntil: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteAdmin(studentId: string): Promise<{
        ok: boolean;
    }>;
    loginStudent(login: string, password: string): Promise<{
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
    changePasswordStudent(studentId: string, currentPassword: string, newPassword: string): Promise<{
        ok: boolean;
    }>;
    getStudentState(student: StudentEntity): {
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
    requireAccess(student: StudentEntity): void;
    getByIdOrThrow(studentId: string): Promise<StudentEntity>;
    private toPublicStudent;
}
