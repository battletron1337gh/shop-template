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
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(entry: AuditEntry): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entityType: string;
        entityId: string | null;
        oldValues: import("@prisma/client/runtime/library").JsonValue | null;
        newValues: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    }>;
}
export {};
