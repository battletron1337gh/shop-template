import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { ReportType } from '@prisma/client';

@Injectable()
export class TaxReportsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('reports') private reportQueue: Queue,
  ) {}

  async findAll(userId: string) {
    return this.prisma.taxReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const report = await this.prisma.taxReport.findFirst({
      where: { id, userId },
    });

    if (!report) {
      throw new NotFoundException('Rapport niet gevonden');
    }

    return report;
  }

  async create(userId: string, data: {
    reportType: ReportType;
    year: number;
    quarter?: number;
  }) {
    // Calculate date range
    let startDate: Date;
    let endDate: Date;

    if (data.reportType === 'btw_quarterly' && data.quarter) {
      const monthStart = (data.quarter - 1) * 3;
      startDate = new Date(data.year, monthStart, 1);
      endDate = new Date(data.year, monthStart + 3, 0);
    } else {
      startDate = new Date(data.year, 0, 1);
      endDate = new Date(data.year, 11, 31);
    }

    // Check if report already exists
    const existing = await this.prisma.taxReport.findFirst({
      where: {
        userId,
        reportType: data.reportType,
        year: data.year,
        quarter: data.quarter,
      },
    });

    if (existing) {
      throw new Error('Er bestaat al een rapport voor deze periode');
    }

    // Create report
    const report = await this.prisma.taxReport.create({
      data: {
        userId,
        reportType: data.reportType,
        year: data.year,
        quarter: data.quarter,
        startDate,
        endDate,
      },
    });

    // Queue for generation
    await this.reportQueue.add('generate-report', {
      reportId: report.id,
      userId,
    });

    return report;
  }

  async getBtwOverview(userId: string, year: number) {
    const quarters = [1, 2, 3, 4];
    
    const quarterData = await Promise.all(
      quarters.map(async (quarter) => {
        const startDate = new Date(year, (quarter - 1) * 3, 1);
        const endDate = new Date(year, quarter * 3, 0);

        const [ridesResult, expensesResult] = await Promise.all([
          this.prisma.ride.aggregate({
            where: {
              userId,
              rideDate: { gte: startDate, lte: endDate },
            },
            _sum: { vatAmount: true },
          }),
          this.prisma.expense.aggregate({
            where: {
              userId,
              expenseDate: { gte: startDate, lte: endDate },
              isDeductible: true,
            },
            _sum: { vatAmount: true },
          }),
        ]);

        const vatReceived = Number(ridesResult._sum.vatAmount || 0);
        const vatPaid = Number(expensesResult._sum.vatAmount || 0);

        return {
          quarter,
          vatReceived,
          vatPaid,
          vatPayable: vatReceived - vatPaid,
        };
      }),
    );

    return {
      year,
      quarters: quarterData,
      totalVatReceived: quarterData.reduce((sum, q) => sum + q.vatReceived, 0),
      totalVatPaid: quarterData.reduce((sum, q) => sum + q.vatPaid, 0),
      totalVatPayable: quarterData.reduce((sum, q) => sum + q.vatPayable, 0),
    };
  }

  async getAnnualSummary(userId: string, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const [ridesResult, expensesResult] = await Promise.all([
      this.prisma.ride.aggregate({
        where: {
          userId,
          rideDate: { gte: startDate, lte: endDate },
        },
        _sum: {
          grossAmount: true,
          netAmount: true,
          vatAmount: true,
        },
        _count: { id: true },
      }),
      this.prisma.expense.aggregate({
        where: {
          userId,
          expenseDate: { gte: startDate, lte: endDate },
          isBusinessExpense: true,
        },
        _sum: {
          amount: true,
          vatAmount: true,
        },
        _count: { id: true },
      }),
    ]);

    const income = Number(ridesResult._sum.netAmount || 0);
    const expenses = Number(expensesResult._sum.amount || 0);
    const profit = income - expenses;

    return {
      year,
      income: {
        gross: Number(ridesResult._sum.grossAmount || 0),
        net: income,
        vat: Number(ridesResult._sum.vatAmount || 0),
        totalRides: ridesResult._count.id,
      },
      expenses: {
        total: expenses,
        vat: Number(expensesResult._sum.vatAmount || 0),
        totalExpenses: expensesResult._count.id,
      },
      profit,
    };
  }
}
