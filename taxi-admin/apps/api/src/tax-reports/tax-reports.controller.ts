import { Controller, Get, Post, Body, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TaxReportsService } from './tax-reports.service';
import { CreateTaxReportDto } from './dto/create-tax-report.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('Belastingrapporten')
@Controller('tax-reports')
@ApiBearerAuth()
export class TaxReportsController {
  constructor(private taxReportsService: TaxReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Alle rapporten ophalen' })
  async findAll(@Request() req) {
    return this.taxReportsService.findAll(req.user.userId);
  }

  @Get('btw-overview')
  @ApiOperation({ summary: 'BTW overzicht per kwartaal' })
  async getBtwOverview(@Request() req, @Query('year') year: number) {
    return this.taxReportsService.getBtwOverview(req.user.userId, +year);
  }

  @Get('annual-summary')
  @ApiOperation({ summary: 'Jaaroverzicht' })
  async getAnnualSummary(@Request() req, @Query('year') year: number) {
    return this.taxReportsService.getAnnualSummary(req.user.userId, +year);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Rapport ophalen' })
  @ApiResponse({ status: 200, description: 'Rapport gevonden' })
  @ApiResponse({ status: 404, description: 'Rapport niet gevonden' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.taxReportsService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Rapport aanmaken' })
  @ApiResponse({ status: 201, description: 'Rapport aangemaakt' })
  async create(@Body() createDto: CreateTaxReportDto, @Request() req) {
    return this.taxReportsService.create(req.user.userId, createDto);
  }
}
