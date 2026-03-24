import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PlatformType, PaymentMethod } from '@prisma/client';

export class FilterRidesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ enum: PlatformType })
  @IsOptional()
  @IsEnum(PlatformType)
  platform?: PlatformType;

  @ApiPropertyOptional({ enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  take?: number;
}
