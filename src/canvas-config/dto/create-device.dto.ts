import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  width: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  height: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  pixelSize: number;
}
