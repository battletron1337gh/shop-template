import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface AuditEntry {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(entry: AuditEntry) {
    return this.prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        oldValues: entry.oldValues,
        newValues: entry.newValues,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });
  }
}
