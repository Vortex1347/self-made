import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { StudentEntity } from '../../entities/student.entity';
declare const StudentJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class StudentJwtStrategy extends StudentJwtStrategy_base {
    private studentRepo;
    constructor(studentRepo: Repository<StudentEntity>);
    validate(payload: {
        sub: string;
        login: string;
        type: string;
    }): Promise<StudentEntity>;
}
export {};
