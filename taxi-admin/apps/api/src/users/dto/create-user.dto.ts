import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'jan@example.nl' })
  @IsEmail({}, { message: 'Voer een geldig e-mailadres in' })
  email: string;

  @ApiProperty({ example: 'veiligWachtwoord123' })
  @IsString()
  @MinLength(6, { message: 'Wachtwoord moet minimaal 6 tekens bevatten' })
  password: string;

  @ApiProperty({ example: 'Jan' })
  @IsString()
  @MinLength(2, { message: 'Voornaam is verplicht' })
  firstName: string;

  @ApiProperty({ example: 'Jansen' })
  @IsString()
  @MinLength(2, { message: 'Achternaam is verplicht' })
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
