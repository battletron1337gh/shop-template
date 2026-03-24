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
exports.ReceiptProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const ai_service_1 = require("../../ai/ai.service");
let ReceiptProcessor = class ReceiptProcessor extends bullmq_1.WorkerHost {
    constructor(prisma, aiService, receiptQueue) {
        super();
        this.prisma = prisma;
        this.aiService = aiService;
        this.receiptQueue = receiptQueue;
    }
    async process(job) {
        const { receiptId, userId } = job.data;
        try {
            await this.prisma.receipt.update({
                where: { id: receiptId },
                data: { status: 'processing' },
            });
            const receipt = await this.prisma.receipt.findFirst({
                where: { id: receiptId, userId },
            });
            if (!receipt) {
                throw new Error('Bonnetje niet gevonden');
            }
            const extractedData = {
                date: new Date().toISOString().split('T')[0],
                total: 50.00,
                vat: 8.68,
                vatRate: '21',
                category: 'brandstof',
                merchant: 'Shell Station',
                description: 'Tanken benzine',
            };
            const expense = await this.prisma.expense.create({
                data: {
                    userId,
                    expenseDate: new Date(extractedData.date || new Date()),
                    category: extractedData.category,
                    description: extractedData.description || 'Uitgave van bonnetje',
                    amount: extractedData.total || 0,
                    vatRate: extractedData.vatRate,
                    receiptId,
                    isBusinessExpense: true,
                },
            });
            await this.prisma.receipt.update({
                where: { id: receiptId },
                data: {
                    status: 'completed',
                    extractedData: extractedData,
                    extractedAmount: extractedData.total,
                    extractedVatAmount: extractedData.vat,
                    extractedDate: extractedData.date ? new Date(extractedData.date) : null,
                    extractedMerchant: extractedData.merchant,
                    processedAt: new Date(),
                    expenseId: expense.id,
                },
            });
            return { success: true, expenseId: expense.id };
        }
        catch (error) {
            console.error('Receipt processing error:', error);
            await this.prisma.receipt.update({
                where: { id: receiptId },
                data: {
                    status: 'failed',
                    errorMessage: error.message,
                },
            });
            throw error;
        }
    }
};
exports.ReceiptProcessor = ReceiptProcessor;
exports.ReceiptProcessor = ReceiptProcessor = __decorate([
    (0, bullmq_1.Processor)('receipts'),
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('receipts')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService,
        bullmq_2.Queue])
], ReceiptProcessor);
//# sourceMappingURL=receipt.processor.js.map