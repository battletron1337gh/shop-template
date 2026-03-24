"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("../prisma/prisma.module");
const ai_module_1 = require("../ai/ai.module");
const receipt_processor_1 = require("./processors/receipt.processor");
const report_processor_1 = require("./processors/report.processor");
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            ai_module_1.AiModule,
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    connection: {
                        url: configService.get('REDIS_URL'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            bullmq_1.BullModule.registerQueue({ name: 'receipts' }, { name: 'reports' }),
        ],
        providers: [receipt_processor_1.ReceiptProcessor, report_processor_1.ReportProcessor],
        exports: [bullmq_1.BullModule],
    })
], QueueModule);
//# sourceMappingURL=queue.module.js.map