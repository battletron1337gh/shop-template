import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
@ApiBearerAuth()
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Dashboard data ophalen' })
  @ApiResponse({ status: 200, description: 'Dashboard data opgehaald' })
  async getDashboard(@Request() req) {
    return this.dashboardService.getDashboardData(req.user.userId);
  }

  @Get('chart')
  @ApiOperation({ summary: 'Grafiekdata ophalen' })
  @ApiQuery({ name: 'period', enum: ['week', 'month', 'quarter', 'year'], required: true })
  @ApiResponse({ status: 200, description: 'Grafiekdata opgehaald' })
  async getChartData(
    @Request() req,
    @Query('period') period: 'week' | 'month' | 'quarter' | 'year',
  ) {
    return this.dashboardService.getChartData(req.user.userId, period);
  }
}
