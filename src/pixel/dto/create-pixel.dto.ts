import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreatePixelDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsInt()
  xQuadrant: number;

  @IsNotEmpty()
  @IsInt()
  yQuadrant: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  colorId: number;
}
