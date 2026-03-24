import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { ReportType } from '@prisma/client';
export declare class TaxReportsService {
    private prisma;
    private reportQueue;
    constructor(prisma: PrismaService, reportQueue: Queue);
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        year: number;
        notes: string | null;
        startDate: Date;
        endDate: Date;
        reportType: import(".prisma/client").$Enums.ReportType;
        quarter: number | null;
        totalIncome: import("@prisma/client/runtime/library").Decimal;
        totalExpenses: import("@prisma/client/runtime/library").Decimal;
        netProfit: import("@prisma/client/runtime/library").Decimal;
        vatCollected: import("@prisma/client/runtime/library").Decimal;
        vatPaid: import("@prisma/client/runtime/library").Decimal;
        vatPayable: import("@prisma/client/runtime/library").Decimal;
        pdfUrl: string | null;
        submittedAt: Date | null;
    }[]>;
    findOne(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        year: number;
        notes: string | null;
        startDate: Date;
        endDate: Date;
        reportType: import(".prisma/client").$Enums.ReportType;
        quarter: number | null;
        totalIncome: import("@prisma/client/runtime/library").Decimal;
        totalExpenses: import("@prisma/client/runtime/library").Decimal;
        netProfit: import("@prisma/client/runtime/library").Decimal;
        vatCollected: import("@prisma/client/runtime/library").Decimal;
        vatPaid: import("@prisma/client/runtime/library").Decimal;
        vatPayable: import("@prisma/client/runtime/library").Decimal;
        pdfUrl: string | null;
        submittedAt: Date | null;
    }>;
    create(userId: string, data: {
        reportType: ReportType;
        year: number;
        quarter?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        year: number;
        notes: string | null;
        startDate: Date;
        endDate: Date;
        reportType: import(".prisma/client").$Enums.ReportType;
        quarter: number | null;
        totalIncome: import("@prisma/client/runtime/library").Decimal;
        totalExpenses: import("@prisma/client/runtime/library").Decimal;
        netProfit: import("@prisma/client/runtime/library").Decimal;
        vatCollected: import("@prisma/client/runtime/library").Decimal;
        vatPaid: import("@prisma/client/runtime/library").Decimal;
        vatPayable: import("@prisma/client/runtime/library").Decimal;
        pdfUrl: string | null;
        submittedAt: Date | null;
    }>;
    getBtwOverview(userId: string, year: number): Promise<{
        year: number;
        quarters: {
            quarter: number;
            vatReceived: number;
            vatPaid: number;
            vatPayable: number;
        }[];
        totalVatReceived: number;
        totalVatPaid: number;
        totalVatPayable: number;
    }>;
    getAnnualSummary(userId: string, year: number): Promise<{
        year: number;
        income: {
            gross: number;
            net: number;
            vat: number;
            totalRides: number;
        };
        expenses: {
            total: number;
            vat: number;
            totalExpenses: number;
        };
        profit: number;
    }>;
}
