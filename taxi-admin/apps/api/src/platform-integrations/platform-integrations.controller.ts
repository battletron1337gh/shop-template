import { Controller, Get, Post, Delete, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformIntegrationsService } from './platform-integrations.service';
import { PlatformType } from '@prisma/client';

@ApiTags('Platform Integraties')
@Controller('platform-integrations')
@ApiBearerAuth()
export class PlatformIntegrationsController {
  constructor(private platformService: PlatformIntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'Alle verbindingen ophalen' })
  async getConnections(@Request() req) {
    return this.platformService.getConnections(req.user.userId);
  }

  @Get(':platform/auth-url')
  @ApiOperation({ summary: 'Auth URL ophalen' })
  async getAuthUrl(@Param('platform') platform: PlatformType, @Request() req) {
    const url = await this.platformService.getAuthUrl(platform, req.user.userId);
    return { authUrl: url };
  }

  @Post(':platform/callback')
  @ApiOperation({ summary: 'OAuth callback verwerken' })
  async handleCallback(
    @Param('platform') platform: PlatformType,
    @Query('code') code: string,
    @Request() req,
  ) {
    return this.platformService.handleCallback(platform, code, req.user.userId);
  }

  @Delete(':platform')
  @ApiOperation({ summary: 'Verbinding verbreken' })
  async disconnect(@Param('platform') platform: PlatformType, @Request() req) {
    return this.platformService.disconnect(req.user.userId, platform);
  }

  @Post(':platform/sync')
  @ApiOperation({ summary: 'Ritten synchroniseren' })
  async syncRides(
    @Param('platform') platform: PlatformType,
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.platformService.syncRides(
      req.user.userId,
      platform,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}
