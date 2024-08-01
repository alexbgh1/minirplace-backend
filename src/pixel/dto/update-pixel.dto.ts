import { IsNotEmpty } from 'class-validator';

export class UpdatePixelDto {
  @IsNotEmpty()
  colorId: string;
}

// export class UpdatePixelDto extends PartialType(CreatePixelDto) {}
