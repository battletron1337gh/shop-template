import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { ReceiptProcessor } from './processors/receipt.processor';
import { ReportProcessor } from './processors/report.processor';

@Module({
  imports: [
    PrismaModule,
    AiModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.get('REDIS_URL'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'receipts' },
      { name: 'reports' },
    ),
  ],
  providers: [ReceiptProcessor, ReportProcessor],
  exports: [BullModule],
})
export class QueueModule {}
