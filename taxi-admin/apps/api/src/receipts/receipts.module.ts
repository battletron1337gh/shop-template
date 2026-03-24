import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ReceiptsService } from './receipts.service';
import { ReceiptsController } from './receipts.controller';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'receipts' }),
  ],
  providers: [ReceiptsService],
  controllers: [ReceiptsController],
  exports: [ReceiptsService],
})
export class ReceiptsModule {}
