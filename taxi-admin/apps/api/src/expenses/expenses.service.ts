import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpensesDto } from './dto/filter-expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, filters: FilterExpensesDto) {
    const where: any = { userId };

    if (filters.startDate) {
      where.expenseDate = { gte: new Date(filters.startDate) };
    }
    
    if (filters.endDate) {
      where.expenseDate = { ...where.expenseDate, lte: new Date(filters.endDate) };
    }
    
    if (filters.category) {
      where.category = filters.category;
    }
    
    if (filters.isBusiness !== undefined) {
      where.isBusinessExpense = filters.isBusiness;
    }

    const [expenses, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        orderBy: { expenseDate: 'desc' },
        include: {
          receipt: true,
          vehicle: true,
        },
        skip: filters.skip || 0,
        take: filters.take || 50,
      }),
      this.prisma.expense.count({ where }),
    ]);

    return { expenses, total };
  }

  async findOne(id: string, userId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, userId },
      include: {
        receipt: true,
        vehicle: true,
      },
    });

    if (!expense) {
      throw new NotFoundException('Kost niet gevonden');
    }

    return expense;
  }

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        userId,
      },
    });
  }

  async update(id: string, userId: string, updateExpenseDto: UpdateExpenseDto) {
    await this.findOne(id, userId);

    return this.prisma.expense.update({
      where: { id },
      data: updateExpenseDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    
    return this.prisma.expense.delete({
      where: { id },
    });
  }

  async getSummary(userId: string, year: number, month?: number) {
    const startDate = month 
      ? new Date(year, month - 1, 1)
      : new Date(year, 0, 1);
    
    const endDate = month
      ? new Date(year, month, 0)
      : new Date(year, 11, 31);

    const [totals, byCategory] = await Promise.all([
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
      this.prisma.expense.groupBy({
        by: ['category'],
        where: {
          userId,
          expenseDate: { gte: startDate, lte: endDate },
          isBusinessExpense: true,
        },
        _sum: { amount: true },
        _count: { id: true },
      }),
    ]);

    return {
      totals: {
        totalAmount: totals._sum.amount || 0,
        totalVat: totals._sum.vatAmount || 0,
        totalExpenses: totals._count.id || 0,
      },
      byCategory: byCategory.map(c => ({
        category: c.category,
        amount: c._sum.amount || 0,
        count: c._count.id,
      })),
    };
  }
}
