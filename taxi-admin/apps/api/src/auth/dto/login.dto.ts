import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'chauffeur@example.nl' })
  @IsEmail({}, { message: 'Voer een geldig e-mailadres in' })
  email: string;

  @ApiProperty({ example: 'wachtwoord123' })
  @IsString()
  @MinLength(6, { message: 'Wachtwoord moet minimaal 6 tekens bevatten' })
  password: string;
}
