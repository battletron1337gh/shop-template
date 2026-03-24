import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpensesDto } from './dto/filter-expenses.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('Kosten')
@Controller('expenses')
@ApiBearerAuth()
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  @ApiOperation({ summary: 'Alle kosten ophalen' })
  @ApiResponse({ status: 200, description: 'Kosten gevonden' })
  async findAll(@Request() req, @Query() filters: FilterExpensesDto) {
    return this.expensesService.findAll(req.user.userId, filters);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Samenvatting kosten per periode' })
  @ApiResponse({ status: 200, description: 'Samenvatting gegenereerd' })
  async getSummary(
    @Request() req,
    @Query('year') year: number,
    @Query('month') month?: number,
  ) {
    return this.expensesService.getSummary(req.user.userId, +year, month ? +month : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Kost ophalen' })
  @ApiResponse({ status: 200, description: 'Kost gevonden' })
  @ApiResponse({ status: 404, description: 'Kost niet gevonden' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.expensesService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Kost toevoegen' })
  @ApiResponse({ status: 201, description: 'Kost toegevoegd' })
  async create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create(req.user.userId, createExpenseDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Kost bijwerken' })
  @ApiResponse({ status: 200, description: 'Kost bijgewerkt' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Request() req,
  ) {
    return this.expensesService.update(id, req.user.userId, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Kost verwijderen' })
  @ApiResponse({ status: 200, description: 'Kost verwijderd' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.expensesService.remove(id, req.user.userId);
  }
}
