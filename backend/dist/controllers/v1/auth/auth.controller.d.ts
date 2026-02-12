import { AuthService } from '../../../services/auth/auth.service';
import { LoginDto } from '../../../dto/auth/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    me(req: {
        user: {
            id: string;
            login: string;
            role: string;
        };
    }): {
        id: string;
        login: string;
        role: string;
    };
}
