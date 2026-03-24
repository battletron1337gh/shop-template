"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpensesService = class ExpensesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, filters) {
        const where = { userId };
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
    async findOne(id, userId) {
        const expense = await this.prisma.expense.findFirst({
            where: { id, userId },
            include: {
                receipt: true,
                vehicle: true,
            },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Kost niet gevonden');
        }
        return expense;
    }
    async create(userId, createExpenseDto) {
        return this.prisma.expense.create({
            data: {
                ...createExpenseDto,
                userId,
            },
        });
    }
    async update(id, userId, updateExpenseDto) {
        await this.findOne(id, userId);
        return this.prisma.expense.update({
            where: { id },
            data: updateExpenseDto,
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.expense.delete({
            where: { id },
        });
    }
    async getSummary(userId, year, month) {
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
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map