import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from 'date-fns';
import { nl } from 'date-fns/locale';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(userId: string) {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const quarterStart = startOfQuarter(today);
    const quarterEnd = endOfQuarter(today);

    const [
      todayStats,
      monthStats,
      quarterStats,
      recentRides,
      topExpenseCategories,
      platformBreakdown,
    ] = await Promise.all([
      // Vandaag
      this.getPeriodStats(userId, todayStart, todayEnd),
      // Deze maand
      this.getPeriodStats(userId, monthStart, monthEnd),
      // Dit kwartaal
      this.getPeriodStats(userId, quarterStart, quarterEnd),
      // Recentste ritten
      this.prisma.ride.findMany({
        where: { userId },
        orderBy: { rideDate: 'desc' },
        take: 5,
      }),
      // Top uitgave categorieën
      this.prisma.expense.groupBy({
        by: ['category'],
        where: {
          userId,
          expenseDate: { gte: monthStart, lte: monthEnd },
          isBusinessExpense: true,
        },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 5,
      }),
      // Platform breakdown
      this.prisma.ride.groupBy({
        by: ['platform'],
        where: {
          userId,
          rideDate: { gte: monthStart, lte: monthEnd },
        },
        _sum: { netAmount: true },
        _count: { id: true },
      }),
    ]);

    return {
      today: todayStats,
      thisMonth: monthStats,
      thisQuarter: quarterStats,
      recentRides,
      topExpenseCategories: topExpenseCategories.map(c => ({
        category: c.category,
        amount: c._sum.amount || 0,
      })),
      platformBreakdown: platformBreakdown.map(p => ({
        platform: p.platform,
        amount: p._sum.netAmount || 0,
        count: p._count.id,
      })),
    };
  }

  private async getPeriodStats(userId: string, startDate: Date, endDate: Date) {
    const [ridesResult, expensesResult] = await Promise.all([
      this.prisma.ride.aggregate({
        where: {
          userId,
          rideDate: { gte: startDate, lte: endDate },
        },
        _sum: {
          grossAmount: true,
          platformCommission: true,
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

    const income = ridesResult._sum.netAmount || 0;
    const expenses = expensesResult._sum.amount || 0;
    const profit = Number(income) - Number(expenses);

    return {
      income: Number(income),
      expenses: Number(expenses),
      profit,
      rideCount: ridesResult._count.id,
      expenseCount: expensesResult._count.id,
      vatOnIncome: Number(ridesResult._sum.vatAmount || 0),
      vatOnExpenses: Number(expensesResult._sum.vatAmount || 0),
    };
  }

  async getChartData(userId: string, period: 'week' | 'month' | 'quarter' | 'year') {
    const today = new Date();
    let startDate: Date;
    let groupBy: string;

    switch (period) {
      case 'week':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        groupBy = 'day';
        break;
      case 'quarter':
        startDate = startOfQuarter(new Date(today.getFullYear(), today.getMonth() - 3, 1));
        groupBy = 'week';
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        groupBy = 'month';
        break;
    }

    const [rides, expenses] = await Promise.all([
      this.prisma.ride.findMany({
        where: {
          userId,
          rideDate: { gte: startDate, lte: today },
        },
        orderBy: { rideDate: 'asc' },
      }),
      this.prisma.expense.findMany({
        where: {
          userId,
          expenseDate: { gte: startDate, lte: today },
          isBusinessExpense: true,
        },
        orderBy: { expenseDate: 'asc' },
      }),
    ]);

    // Group data by period
    const chartData = this.groupDataByPeriod(rides, expenses, groupBy, startDate, today);

    return chartData;
  }

  private groupDataByPeriod(
    rides: any[],
    expenses: any[],
    groupBy: string,
    startDate: Date,
    endDate: Date
  ) {
    const data: any[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const label = this.getLabelForDate(currentDate, groupBy);
      const periodStart = new Date(currentDate);
      let periodEnd: Date;

      if (groupBy === 'day') {
        periodEnd = endOfDay(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (groupBy === 'week') {
        periodEnd = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        currentDate.setDate(currentDate.getDate() + 7);
      } else {
        periodEnd = endOfMonth(currentDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      const periodRides = rides.filter(
        r => r.rideDate >= periodStart && r.rideDate <= periodEnd
      );
      const periodExpenses = expenses.filter(
        e => e.expenseDate >= periodStart && e.expenseDate <= periodEnd
      );

      const income = periodRides.reduce((sum, r) => sum + Number(r.netAmount), 0);
      const cost = periodExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

      data.push({
        label,
        income,
        expenses: cost,
        profit: income - cost,
      });
    }

    return data;
  }

  private getLabelForDate(date: Date, groupBy: string): string {
    switch (groupBy) {
      case 'day':
        return format(date, 'EEE d', { locale: nl });
      case 'week':
        return `Week ${format(date, 'w', { locale: nl })}`;
      case 'month':
        return format(date, 'MMMM', { locale: nl });
      default:
        return format(date, 'dd-MM');
    }
  }
}
