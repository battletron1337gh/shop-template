import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            onboardingCompleted: any;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
            onboardingCompleted: boolean;
        };
    }>;
    getProfile(req: any): any;
    refresh(req: any): Promise<{
        access_token: string;
    }>;
}
