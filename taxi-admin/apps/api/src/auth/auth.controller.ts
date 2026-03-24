import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('Authenticatie')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inloggen' })
  @ApiResponse({ status: 200, description: 'Succesvol ingelogd' })
  @ApiResponse({ status: 401, description: 'Ongeldige inloggegevens' })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registreren' })
  @ApiResponse({ status: 201, description: 'Account succesvol aangemaakt' })
  @ApiResponse({ status: 409, description: 'E-mailadres is al in gebruik' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Huidige gebruiker ophalen' })
  @ApiResponse({ status: 200, description: 'Gebruiker gevonden' })
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Token vernieuwen' })
  @ApiResponse({ status: 200, description: 'Token vernieuwd' })
  async refresh(@Request() req) {
    return this.authService.refreshToken(req.user.userId);
  }
}
