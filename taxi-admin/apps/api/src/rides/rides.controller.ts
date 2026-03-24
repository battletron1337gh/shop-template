import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { FilterRidesDto } from './dto/filter-rides.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('Ritten')
@Controller('rides')
@ApiBearerAuth()
export class RidesController {
  constructor(private ridesService: RidesService) {}

  @Get()
  @ApiOperation({ summary: 'Alle ritten ophalen' })
  @ApiResponse({ status: 200, description: 'Ritten gevonden' })
  async findAll(@Request() req, @Query() filters: FilterRidesDto) {
    return this.ridesService.findAll(req.user.userId, filters);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Samenvatting ritten per periode' })
  @ApiResponse({ status: 200, description: 'Samenvatting gegenereerd' })
  async getSummary(
    @Request() req,
    @Query('year') year: number,
    @Query('month') month?: number,
  ) {
    return this.ridesService.getSummary(req.user.userId, +year, month ? +month : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Rit ophalen' })
  @ApiResponse({ status: 200, description: 'Rit gevonden' })
  @ApiResponse({ status: 404, description: 'Rit niet gevonden' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.ridesService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Rit toevoegen' })
  @ApiResponse({ status: 201, description: 'Rit toegevoegd' })
  async create(@Body() createRideDto: CreateRideDto, @Request() req) {
    try {
      return await this.ridesService.create(req.user.userId, createRideDto);
    } catch (error) {
      console.error('❌ ERROR creating ride:', error);
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rit bijwerken' })
  @ApiResponse({ status: 200, description: 'Rit bijgewerkt' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRideDto: UpdateRideDto,
    @Request() req,
  ) {
    return this.ridesService.update(id, req.user.userId, updateRideDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Rit verwijderen' })
  @ApiResponse({ status: 200, description: 'Rit verwijderd' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.ridesService.remove(id, req.user.userId);
  }
}
