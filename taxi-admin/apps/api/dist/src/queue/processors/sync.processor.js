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
exports.SyncProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const platform_integrations_service_1 = require("../../platform-integrations/platform-integrations.service");
let SyncProcessor = class SyncProcessor extends bullmq_1.WorkerHost {
    constructor(prisma, platformService) {
        super();
        this.prisma = prisma;
        this.platformService = platformService;
    }
    async process(job) {
        const { userId, platform, startDate, endDate } = job.data;
        const syncJob = await this.prisma.syncJob.create({
            data: {
                userId,
                platform,
                status: 'running',
                startedAt: new Date(),
            },
        });
        try {
            const result = await this.platformService.syncRides(userId, platform, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
            await this.prisma.syncJob.update({
                where: { id: syncJob.id },
                data: {
                    status: 'completed',
                    completedAt: new Date(),
                    ridesImported: result.imported,
                },
            });
            return result;
        }
        catch (error) {
            await this.prisma.syncJob.update({
                where: { id: syncJob.id },
                data: {
                    status: 'failed',
                    completedAt: new Date(),
                    errorMessage: error.message,
                },
            });
            throw error;
        }
    }
};
exports.SyncProcessor = SyncProcessor;
exports.SyncProcessor = SyncProcessor = __decorate([
    (0, bullmq_1.Processor)('sync'),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        platform_integrations_service_1.PlatformIntegrationsService])
], SyncProcessor);
//# sourceMappingURL=sync.processor.js.map