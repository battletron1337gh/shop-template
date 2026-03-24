import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export declare class UberService {
    private configService;
    private httpService;
    private readonly clientId;
    private readonly clientSecret;
    private readonly redirectUri;
    private readonly authUrl;
    private readonly tokenUrl;
    private readonly apiBaseUrl;
    constructor(configService: ConfigService, httpService: HttpService);
    getAuthUrl(userId: string): string;
    exchangeCodeForTokens(code: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresAt: Date;
    }>;
    getUserInfo(accessToken: string): Promise<{
        userId: string;
        email: string;
    }>;
    getTrips(accessToken: string, startDate?: Date, endDate?: Date): Promise<any[]>;
    private generateMockTrips;
}
