import { Controller, Get, Post, Delete, Param, Query, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ReceiptsService } from './receipts.service';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('Bonnetjes')
@Controller('receipts')
@ApiBearerAuth()
export class ReceiptsController {
  constructor(private receiptsService: ReceiptsService) {}

  @Get()
  @ApiOperation({ summary: 'Alle bonnetjes ophalen' })
  async findAll(@Request() req, @Query('status') status?: string) {
    return this.receiptsService.findAll(req.user.userId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bonnetje ophalen' })
  @ApiResponse({ status: 200, description: 'Bonnetje gevonden' })
  @ApiResponse({ status: 404, description: 'Bonnetje niet gevonden' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.receiptsService.findOne(id, req.user.userId);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Bonnetje uploaden' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.receiptsService.upload(req.user.userId, file);
  }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Verwerking opnieuw proberen' })
  async retryProcessing(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.receiptsService.retryProcessing(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Bonnetje verwijderen' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.receiptsService.remove(id, req.user.userId);
  }
}
