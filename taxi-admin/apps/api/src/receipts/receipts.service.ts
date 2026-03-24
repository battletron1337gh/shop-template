import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ReceiptsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('receipts') private receiptQueue: Queue,
  ) {}

  async findAll(userId: string, status?: string) {
    return this.prisma.receipt.findMany({
      where: { userId, ...(status && { status: status as any }) },
      orderBy: { createdAt: 'desc' },
      include: {
        expenses: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const receipt = await this.prisma.receipt.findFirst({
      where: { id, userId },
      include: {
        expenses: true,
      },
    });

    if (!receipt) {
      throw new NotFoundException('Bonnetje niet gevonden');
    }

    return receipt;
  }

  async upload(userId: string, file: Express.Multer.File) {
    // Create uploads directory if not exists
    const uploadDir = './uploads/receipts';
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${userId}_${timestamp}_${file.originalname}`;
    const filePath = path.join(uploadDir, filename);

    // Save file
    await fs.writeFile(filePath, file.buffer);

    // Create receipt record
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

    // Queue for AI processing
    await this.receiptQueue.add('process', {
      receiptId: receipt.id,
      userId,
    });

    return receipt;
  }

  async remove(id: string, userId: string) {
    const receipt = await this.findOne(id, userId);

    // Delete file
    try {
      await fs.unlink(receipt.filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    // Delete record
    return this.prisma.receipt.delete({
      where: { id },
    });
  }

  async retryProcessing(id: string, userId: string) {
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
}
