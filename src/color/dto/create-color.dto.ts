import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateColorDto {
  @IsString()
  @IsNotEmpty()
  @Matches('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')
  hex: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
