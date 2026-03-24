import { PlatformType, PaymentMethod, VatRate } from '@prisma/client';
export declare class CreateRideDto {
    rideDate: string;
    rideTime?: string;
    grossAmount: number;
    platformCommission?: number;
    platform?: PlatformType;
    paymentMethod?: PaymentMethod;
    vatRate?: VatRate;
    description?: string;
    distanceKm?: number;
    durationMinutes?: number;
    pickupAddress?: string;
    destinationAddress?: string;
}
