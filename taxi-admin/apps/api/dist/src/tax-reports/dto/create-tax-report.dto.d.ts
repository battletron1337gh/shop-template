import { ReportType } from '@prisma/client';
export declare class CreateTaxReportDto {
    reportType: ReportType;
    year: number;
    quarter?: number;
}
