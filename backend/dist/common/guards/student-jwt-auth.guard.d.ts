import { ExecutionContext } from '@nestjs/common';
declare const StudentJwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class StudentJwtAuthGuard extends StudentJwtAuthGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest<TUser = unknown>(err: unknown, user: TUser, _info?: unknown, _context?: ExecutionContext, _status?: unknown): TUser;
}
export {};
