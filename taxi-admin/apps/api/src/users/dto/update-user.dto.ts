import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'KVK nummer' })
  @IsOptional()
  @IsString()
  kvkNumber?: string;

  @ApiPropertyOptional({ description: 'BTW nummer' })
  @IsOptional()
  @IsString()
  btwNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ description: 'KOR regeling (Kleine Ondernemers Regeling)' })
  @IsOptional()
  @IsBoolean()
  korSchemeEnabled?: boolean;
}
