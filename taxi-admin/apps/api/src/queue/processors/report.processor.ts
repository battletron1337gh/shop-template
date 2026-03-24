import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface ReportJobData {
  reportId: string;
  userId: string;
}

@Processor('reports')
@Injectable()
export class ReportProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<ReportJobData>) {
    const { reportId, userId } = job.data;

    const report = await this.prisma.taxReport.findFirst({
      where: { id: reportId, userId },
    });

    if (!report) {
      throw new Error('Rapport niet gevonden');
    }

    // Calculate totals
    const [ridesResult, expensesResult] = await Promise.all([
      this.prisma.ride.aggregate({
        where: {
          userId,
          rideDate: { gte: report.startDate, lte: report.endDate },
        },
        _sum: {
          netAmount: true,
          vatAmount: true,
        },
      }),
      this.prisma.expense.aggregate({
        where: {
          userId,
          expenseDate: { gte: report.startDate, lte: report.endDate },
          isBusinessExpense: true,
          isDeductible: true,
        },
        _sum: {
          amount: true,
          vatAmount: true,
        },
      }),
    ]);

    const income = Number(ridesResult._sum.netAmount || 0);
    const expenses = Number(expensesResult._sum.amount || 0);
    const profit = income - expenses;
    const vatCollected = Number(ridesResult._sum.vatAmount || 0);
    const vatPaid = Number(expensesResult._sum.vatAmount || 0);
    const vatPayable = vatCollected - vatPaid;

    // Update report
    await this.prisma.taxReport.update({
      where: { id: reportId },
      data: {
        totalIncome: income,
        totalExpenses: expenses,
        netProfit: profit,
        vatCollected,
        vatPaid,
        vatPayable,
        status: 'generated',
      },
    });

    // TODO: Generate PDF
    // For now, we'll just mark it as generated

    return { success: true };
  }
}
