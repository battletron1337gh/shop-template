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
exports.ReceiptsService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = require("fs/promises");
const path = require("path");
let ReceiptsService = class ReceiptsService {
    constructor(prisma, receiptQueue) {
        this.prisma = prisma;
        this.receiptQueue = receiptQueue;
    }
    async findAll(userId, status) {
        return this.prisma.receipt.findMany({
            where: { userId, ...(status && { status: status }) },
            orderBy: { createdAt: 'desc' },
            include: {
                expenses: true,
            },
        });
    }
    async findOne(id, userId) {
        const receipt = await this.prisma.receipt.findFirst({
            where: { id, userId },
            include: {
                expenses: true,
            },
        });
        if (!receipt) {
            throw new common_1.NotFoundException('Bonnetje niet gevonden');
        }
        return receipt;
    }
    async upload(userId, file) {
        const uploadDir = './uploads/receipts';
        await fs.mkdir(uploadDir, { recursive: true });
        const timestamp = Date.now();
        const filename = `${userId}_${timestamp}_${file.originalname}`;
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, file.buffer);
        const receipt = await this.prisma.receipt.create({
            data: {
                userId,
                filename,
                originalFilename: file.originalname,
                mimeType: file.mimetype,
                fileSize: file.size,
                filePath,
                status: 'pending',
            },
        });
        await this.receiptQueue.add('process', {
            receiptId: receipt.id,
            userId,
        });
        return receipt;
    }
    async remove(id, userId) {
        const receipt = await this.findOne(id, userId);
        try {
            await fs.unlink(receipt.filePath);
        }
        catch (error) {
            console.error('Error deleting file:', error);
        }
        return this.prisma.receipt.delete({
            where: { id },
        });
    }
    async retryProcessing(id, userId) {
        const receipt = await this.findOne(id, userId);
        if (receipt.status === 'completed') {
            throw new Error('Bonnetje is al verwerkt');
        }
        await this.prisma.receipt.update({
            where: { id },
            data: { status: 'pending', errorMessage: null },
        });
        await this.receiptQueue.add('process', {
            receiptId: receipt.id,
            userId,
        });
        return { message: 'Verwerking opnieuw gestart' };
    }
};
exports.ReceiptsService = ReceiptsService;
exports.ReceiptsService = ReceiptsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('receipts')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue])
], ReceiptsService);
//# sourceMappingURL=receipts.service.js.map