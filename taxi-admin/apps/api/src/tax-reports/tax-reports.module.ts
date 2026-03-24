import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TaxReportsService } from './tax-reports.service';
import { TaxReportsController } from './tax-reports.controller';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'reports' }),
  ],
  providers: [TaxReportsService],
  controllers: [TaxReportsController],
  exports: [TaxReportsService],
})
export class TaxReportsModule {}
