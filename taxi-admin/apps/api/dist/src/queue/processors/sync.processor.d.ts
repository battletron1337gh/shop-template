import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { PlatformIntegrationsService } from '../../platform-integrations/platform-integrations.service';
import { PlatformType } from '@prisma/client';
interface SyncJobData {
    userId: string;
    platform: PlatformType;
    startDate?: string;
    endDate?: string;
}
export declare class SyncProcessor extends WorkerHost {
    private prisma;
    private platformService;
    constructor(prisma: PrismaService, platformService: PlatformIntegrationsService);
    process(job: Job<SyncJobData>): Promise<{
        imported: number;
    }>;
}
export {};
