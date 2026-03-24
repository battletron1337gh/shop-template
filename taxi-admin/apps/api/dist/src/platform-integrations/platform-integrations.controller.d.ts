import { PlatformIntegrationsService } from './platform-integrations.service';
import { PlatformType } from '@prisma/client';
export declare class PlatformIntegrationsController {
    private platformService;
    constructor(platformService: PlatformIntegrationsService);
    getConnections(req: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        platform: import(".prisma/client").$Enums.PlatformType;
        accessToken: string | null;
        refreshToken: string | null;
        tokenExpiresAt: Date | null;
        externalUserId: string | null;
        externalEmail: string | null;
        lastSyncAt: Date | null;
    }[]>;
    getAuthUrl(platform: PlatformType, req: any): Promise<{
        authUrl: string;
    }>;
    handleCallback(platform: PlatformType, code: string, req: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        platform: import(".prisma/client").$Enums.PlatformType;
        accessToken: string | null;
        refreshToken: string | null;
        tokenExpiresAt: Date | null;
        externalUserId: string | null;
        externalEmail: string | null;
        lastSyncAt: Date | null;
    }>;
    disconnect(platform: PlatformType, req: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        platform: import(".prisma/client").$Enums.PlatformType;
        accessToken: string | null;
        refreshToken: string | null;
        tokenExpiresAt: Date | null;
        externalUserId: string | null;
        externalEmail: string | null;
        lastSyncAt: Date | null;
    }>;
    syncRides(platform: PlatformType, req: any, startDate?: string, endDate?: string): Promise<{
        imported: number;
    }>;
}
