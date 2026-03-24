import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardData(userId: string): Promise<{
        today: {
            income: number;
            expenses: number;
            profit: number;
            rideCount: number;
            expenseCount: number;
            vatOnIncome: number;
            vatOnExpenses: number;
        };
        thisMonth: {
            income: number;
            expenses: number;
            profit: number;
            rideCount: number;
            expenseCount: number;
            vatOnIncome: number;
            vatOnExpenses: number;
        };
        thisQuarter: {
            income: number;
            expenses: number;
            profit: number;
            rideCount: number;
            expenseCount: number;
            vatOnIncome: number;
            vatOnExpenses: number;
        };
        recentRides: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description: string | null;
            vatRate: import(".prisma/client").$Enums.VatRate;
            vatAmount: import("@prisma/client/runtime/library").Decimal;
            rideDate: Date;
            rideTime: Date | null;
            grossAmount: import("@prisma/client/runtime/library").Decimal;
            platformCommission: import("@prisma/client/runtime/library").Decimal;
            platform: import(".prisma/client").$Enums.PlatformType;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            distanceKm: import("@prisma/client/runtime/library").Decimal | null;
            durationMinutes: number | null;
            pickupAddress: string | null;
            destinationAddress: string | null;
            platformConnectionId: string | null;
            externalRideId: string | null;
            netAmount: import("@prisma/client/runtime/library").Decimal;
            isManualEntry: boolean;
            syncedFromPlatform: boolean;
        }[];
        topExpenseCategories: {
            category: import(".prisma/client").$Enums.ExpenseCategory;
            amount: number | import("@prisma/client/runtime/library").Decimal;
        }[];
        platformBreakdown: {
            platform: import(".prisma/client").$Enums.PlatformType;
            amount: number | import("@prisma/client/runtime/library").Decimal;
            count: number;
        }[];
    }>;
    private getPeriodStats;
    getChartData(userId: string, period: 'week' | 'month' | 'quarter' | 'year'): Promise<any[]>;
    private groupDataByPeriod;
    private getLabelForDate;
}
