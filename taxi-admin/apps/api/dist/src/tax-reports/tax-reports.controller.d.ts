import { TaxReportsService } from './tax-reports.service';
import { CreateTaxReportDto } from './dto/create-tax-report.dto';
export declare class TaxReportsController {
    private taxReportsService;
    constructor(taxReportsService: TaxReportsService);
    findAll(req: any): Promise<{
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
    getBtwOverview(req: any, year: number): Promise<{
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
    getAnnualSummary(req: any, year: number): Promise<{
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
    findOne(id: string, req: any): Promise<{
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
    create(createDto: CreateTaxReportDto, req: any): Promise<{
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
}
