import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
interface ReportJobData {
    reportId: string;
    userId: string;
}
export declare class ReportProcessor extends WorkerHost {
    private prisma;
    constructor(prisma: PrismaService);
    process(job: Job<ReportJobData>): Promise<{
        success: boolean;
    }>;
}
export {};
