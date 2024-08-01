import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class UserColorStatDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Matches('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')
  hex: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  count: number;
}
