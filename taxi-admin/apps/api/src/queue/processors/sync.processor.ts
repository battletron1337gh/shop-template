import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PlatformIntegrationsService } from '../../platform-integrations/platform-integrations.service';
import { PlatformType } from '@prisma/client';

interface SyncJobData {
  userId: string;
  platform: PlatformType;
  startDate?: string;
  endDate?: string;
}

@Processor('sync')
@Injectable()
export class SyncProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private platformService: PlatformIntegrationsService,
  ) {
    super();
  }

  async process(job: Job<SyncJobData>) {
    const { userId, platform, startDate, endDate } = job.data;

    // Create sync job record
    const syncJob = await this.prisma.syncJob.create({
      data: {
        userId,
        platform,
        status: 'running',
        startedAt: new Date(),
      },
    });

    try {
      const result = await this.platformService.syncRides(
        userId,
        platform,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
      );

      await this.prisma.syncJob.update({
        where: { id: syncJob.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          ridesImported: result.imported,
        },
      });

      return result;
    } catch (error) {
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
}
