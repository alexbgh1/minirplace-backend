import {
  IsString,
  MinLength,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsDate,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches('^[a-zA-Z0-9_.-]*$')
  @MinLength(1)
  @MaxLength(16)
  username: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  country_name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  country_code?: string;

  @IsOptional()
  @IsDate()
  last_login?: Date;
}
