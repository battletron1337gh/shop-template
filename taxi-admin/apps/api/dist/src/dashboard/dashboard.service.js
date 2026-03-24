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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardData(userId) {
        const today = new Date();
        const todayStart = (0, date_fns_1.startOfDay)(today);
        const todayEnd = (0, date_fns_1.endOfDay)(today);
        const monthStart = (0, date_fns_1.startOfMonth)(today);
        const monthEnd = (0, date_fns_1.endOfMonth)(today);
        const quarterStart = (0, date_fns_1.startOfQuarter)(today);
        const quarterEnd = (0, date_fns_1.endOfQuarter)(today);
        const [todayStats, monthStats, quarterStats, recentRides, topExpenseCategories, platformBreakdown,] = await Promise.all([
            this.getPeriodStats(userId, todayStart, todayEnd),
            this.getPeriodStats(userId, monthStart, monthEnd),
            this.getPeriodStats(userId, quarterStart, quarterEnd),
            this.prisma.ride.findMany({
                where: { userId },
                orderBy: { rideDate: 'desc' },
                take: 5,
            }),
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
    async getPeriodStats(userId, startDate, endDate) {
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
    async getChartData(userId, period) {
        const today = new Date();
        let startDate;
        let groupBy;
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
                startDate = (0, date_fns_1.startOfQuarter)(new Date(today.getFullYear(), today.getMonth() - 3, 1));
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
        const chartData = this.groupDataByPeriod(rides, expenses, groupBy, startDate, today);
        return chartData;
    }
    groupDataByPeriod(rides, expenses, groupBy, startDate, endDate) {
        const data = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const label = this.getLabelForDate(currentDate, groupBy);
            const periodStart = new Date(currentDate);
            let periodEnd;
            if (groupBy === 'day') {
                periodEnd = (0, date_fns_1.endOfDay)(currentDate);
                currentDate.setDate(currentDate.getDate() + 1);
            }
            else if (groupBy === 'week') {
                periodEnd = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                currentDate.setDate(currentDate.getDate() + 7);
            }
            else {
                periodEnd = (0, date_fns_1.endOfMonth)(currentDate);
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
            const periodRides = rides.filter(r => r.rideDate >= periodStart && r.rideDate <= periodEnd);
            const periodExpenses = expenses.filter(e => e.expenseDate >= periodStart && e.expenseDate <= periodEnd);
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
    getLabelForDate(date, groupBy) {
        switch (groupBy) {
            case 'day':
                return (0, date_fns_1.format)(date, 'EEE d', { locale: locale_1.nl });
            case 'week':
                return `Week ${(0, date_fns_1.format)(date, 'w', { locale: locale_1.nl })}`;
            case 'month':
                return (0, date_fns_1.format)(date, 'MMMM', { locale: locale_1.nl });
            default:
                return (0, date_fns_1.format)(date, 'dd-MM');
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map