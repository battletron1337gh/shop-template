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
exports.ReportProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ReportProcessor = class ReportProcessor extends bullmq_1.WorkerHost {
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async process(job) {
        const { reportId, userId } = job.data;
        const report = await this.prisma.taxReport.findFirst({
            where: { id: reportId, userId },
        });
        if (!report) {
            throw new Error('Rapport niet gevonden');
        }
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
        return { success: true };
    }
};
exports.ReportProcessor = ReportProcessor;
exports.ReportProcessor = ReportProcessor = __decorate([
    (0, bullmq_1.Processor)('reports'),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportProcessor);
//# sourceMappingURL=report.processor.js.map