import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepo;
    constructor(userRepo: Repository<UserEntity>);
    validate(payload: {
        sub: string;
        login: string;
        role: string;
    }): Promise<UserEntity>;
}
export {};
