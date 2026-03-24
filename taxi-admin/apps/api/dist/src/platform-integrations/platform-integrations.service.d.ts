import { PrismaService } from '../prisma/prisma.service';
import { UberService } from './services/uber.service';
import { BoltService } from './services/bolt.service';
import { PlatformType } from '@prisma/client';
export declare class PlatformIntegrationsService {
    private prisma;
    private uberService;
    private boltService;
    constructor(prisma: PrismaService, uberService: UberService, boltService: BoltService);
    getConnections(userId: string): Promise<{
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
    getConnection(userId: string, platform: PlatformType): Promise<{
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
    getAuthUrl(platform: PlatformType, userId: string): Promise<string>;
    handleCallback(platform: PlatformType, code: string, userId: string): Promise<{
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
    disconnect(userId: string, platform: PlatformType): Promise<{
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
    syncRides(userId: string, platform: PlatformType, startDate?: Date, endDate?: Date): Promise<{
        imported: number;
    }>;
    private getValidToken;
    private transformRide;
    private saveRides;
}
