import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';
import { ExpenseCategory } from '@prisma/client';

interface ReceiptJobData {
  receiptId: string;
  userId: string;
}

@Processor('receipts')
@Injectable()
export class ReceiptProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    @InjectQueue('receipts') private receiptQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<ReceiptJobData>) {
    const { receiptId, userId } = job.data;

    try {
      // Update status to processing
      await this.prisma.receipt.update({
        where: { id: receiptId },
        data: { status: 'processing' },
      });

      // Get receipt
      const receipt = await this.prisma.receipt.findFirst({
        where: { id: receiptId, userId },
      });

      if (!receipt) {
        throw new Error('Bonnetje niet gevonden');
      }

      // TODO: Read file and convert to base64
      // For now, we'll skip the actual file reading in this example
      // In production: const imageBase64 = await fs.readFile(receipt.filePath, { encoding: 'base64' });
      
      // Mock extraction for development
      const extractedData = {
        date: new Date().toISOString().split('T')[0],
        total: 50.00,
        vat: 8.68,
        vatRate: '21' as const,
        category: 'brandstof',
        merchant: 'Shell Station',
        description: 'Tanken benzine',
      };

      // Create expense from extracted data
      const expense = await this.prisma.expense.create({
        data: {
          userId,
          expenseDate: new Date(extractedData.date || new Date()),
          category: extractedData.category as ExpenseCategory,
          description: extractedData.description || 'Uitgave van bonnetje',
          amount: extractedData.total || 0,
          vatRate: extractedData.vatRate as any,
          receiptId,
          isBusinessExpense: true,
        },
      });

      // Update receipt
      await this.prisma.receipt.update({
        where: { id: receiptId },
        data: {
          status: 'completed',
          extractedData: extractedData as any,
          extractedAmount: extractedData.total,
          extractedVatAmount: extractedData.vat,
          extractedDate: extractedData.date ? new Date(extractedData.date) : null,
          extractedMerchant: extractedData.merchant,
          processedAt: new Date(),
          expenseId: expense.id,
        },
      });

      return { success: true, expenseId: expense.id };
    } catch (error) {
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
}
