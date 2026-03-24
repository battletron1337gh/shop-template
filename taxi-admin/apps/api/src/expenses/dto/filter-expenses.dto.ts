import { IsOptional, IsString, IsEnum, IsNumber, Min, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseCategory } from '@prisma/client';

export class FilterExpensesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ enum: ExpenseCategory })
  @IsOptional()
  @IsEnum(ExpenseCategory)
  category?: ExpenseCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isBusiness?: boolean;

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
