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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxReportsService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
let TaxReportsService = class TaxReportsService {
    constructor(prisma, reportQueue) {
        this.prisma = prisma;
        this.reportQueue = reportQueue;
    }
    async findAll(userId) {
        return this.prisma.taxReport.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const report = await this.prisma.taxReport.findFirst({
            where: { id, userId },
        });
        if (!report) {
            throw new common_1.NotFoundException('Rapport niet gevonden');
        }
        return report;
    }
    async create(userId, data) {
        let startDate;
        let endDate;
        if (data.reportType === 'btw_quarterly' && data.quarter) {
            const monthStart = (data.quarter - 1) * 3;
            startDate = new Date(data.year, monthStart, 1);
            endDate = new Date(data.year, monthStart + 3, 0);
        }
        else {
            startDate = new Date(data.year, 0, 1);
            endDate = new Date(data.year, 11, 31);
        }
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
        await this.reportQueue.add('generate-report', {
            reportId: report.id,
            userId,
        });
        return report;
    }
    async getBtwOverview(userId, year) {
        const quarters = [1, 2, 3, 4];
        const quarterData = await Promise.all(quarters.map(async (quarter) => {
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
        }));
        return {
            year,
            quarters: quarterData,
            totalVatReceived: quarterData.reduce((sum, q) => sum + q.vatReceived, 0),
            totalVatPaid: quarterData.reduce((sum, q) => sum + q.vatPaid, 0),
            totalVatPayable: quarterData.reduce((sum, q) => sum + q.vatPayable, 0),
        };
    }
    async getAnnualSummary(userId, year) {
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
};
exports.TaxReportsService = TaxReportsService;
exports.TaxReportsService = TaxReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('reports')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue])
], TaxReportsService);
//# sourceMappingURL=tax-reports.service.js.map