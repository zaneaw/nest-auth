import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  @ValidateIf((dto) => !dto.username || (dto.email && dto.username))
  @IsString()
  @IsEmail()
  email?: string;

  @ValidateIf((dto) => !dto.email || (dto.email && dto.username))
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
