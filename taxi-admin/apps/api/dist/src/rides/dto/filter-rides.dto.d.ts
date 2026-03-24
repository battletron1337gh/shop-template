import { PlatformType, PaymentMethod } from '@prisma/client';
export declare class FilterRidesDto {
    startDate?: string;
    endDate?: string;
    platform?: PlatformType;
    paymentMethod?: PaymentMethod;
    skip?: number;
    take?: number;
}
