import { Controller, Get, Post, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Gebruikers')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Profiel ophalen' })
  @ApiResponse({ status: 200, description: 'Profiel gevonden' })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Profiel bijwerken' })
  @ApiResponse({ status: 200, description: 'Profiel bijgewerkt' })
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @Post('onboarding/complete')
  @ApiOperation({ summary: 'Onboarding afronden' })
  @ApiResponse({ status: 200, description: 'Onboarding afgerond' })
  async completeOnboarding(@Request() req) {
    return this.usersService.completeOnboarding(req.user.userId);
  }
}

