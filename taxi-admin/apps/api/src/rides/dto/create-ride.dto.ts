import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlatformType, PaymentMethod, VatRate } from '@prisma/client';

export class CreateRideDto {
  @ApiProperty({ description: 'Datum van de rit' })
  @IsDateString()
  rideDate: string;

  @ApiPropertyOptional({ description: 'Tijd van de rit' })
  @IsOptional()
  @IsString()
  rideTime?: string;

  @ApiProperty({ description: 'Bruto bedrag' })
  @IsNumber()
  grossAmount: number;

  @ApiPropertyOptional({ description: 'Platform commissie' })
  @IsOptional()
  @IsNumber()
  platformCommission?: number;

  @ApiPropertyOptional({ enum: PlatformType })
  @IsOptional()
  @IsEnum(PlatformType)
  platform?: PlatformType;

  @ApiPropertyOptional({ enum: PaymentMethod, default: PaymentMethod.card })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ enum: VatRate, default: VatRate.ZERO })
  @IsOptional()
  @IsEnum(VatRate)
  vatRate?: VatRate;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Afstand in kilometers' })
  @IsOptional()
  @IsNumber()
  distanceKm?: number;

  @ApiPropertyOptional({ description: 'Duur in minuten' })
  @IsOptional()
  @IsNumber()
  durationMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pickupAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  destinationAddress?: string;
}
