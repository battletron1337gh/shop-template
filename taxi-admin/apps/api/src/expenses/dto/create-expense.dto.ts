import { IsString, IsNumber, IsOptional, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseCategory, VatRate } from '@prisma/client';

export class CreateExpenseDto {
  @ApiProperty({ description: 'Datum van de uitgave' })
  @IsDateString()
  expenseDate: string;

  @ApiProperty({ enum: ExpenseCategory, description: 'Categorie' })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({ description: 'Omschrijving' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Bedrag' })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ enum: VatRate, default: VatRate.TWENTY_ONE })
  @IsOptional()
  @IsEnum(VatRate)
  vatRate?: VatRate;

  @ApiPropertyOptional({ description: 'Zakelijke uitgave', default: true })
  @IsOptional()
  @IsBoolean()
  isBusinessExpense?: boolean;

  @ApiPropertyOptional({ description: 'Aftrekbaar', default: true })
  @IsOptional()
  @IsBoolean()
  isDeductible?: boolean;

  @ApiPropertyOptional({ description: 'Kilometers (voor reiskosten)' })
  @IsOptional()
  @IsNumber()
  kilometers?: number;

  @ApiPropertyOptional({ description: 'Voertuig ID' })
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
