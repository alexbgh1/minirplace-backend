import { IsNotEmpty, IsString } from 'class-validator';

export class SeedExecuteDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
