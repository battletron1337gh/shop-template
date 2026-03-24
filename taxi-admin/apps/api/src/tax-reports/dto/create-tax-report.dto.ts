import { IsEnum, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportType } from '@prisma/client';

export class CreateTaxReportDto {
  @ApiProperty({ enum: ReportType, description: 'Type rapport' })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty({ description: 'Jaar' })
  @IsNumber()
  year: number;

  @ApiPropertyOptional({ description: 'Kwartaal (1-4), alleen voor BTW rapporten' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  quarter?: number;
}
