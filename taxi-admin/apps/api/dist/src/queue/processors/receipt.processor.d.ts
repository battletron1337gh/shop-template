import { WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';
interface ReceiptJobData {
    receiptId: string;
    userId: string;
}
export declare class ReceiptProcessor extends WorkerHost {
    private prisma;
    private aiService;
    private receiptQueue;
    constructor(prisma: PrismaService, aiService: AiService, receiptQueue: Queue);
    process(job: Job<ReceiptJobData>): Promise<{
        success: boolean;
        expenseId: string;
    }>;
}
export {};
