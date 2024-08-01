import { PartialType } from '@nestjs/mapped-types';
import { UpdatePixelDto } from '../../pixel/dto/update-pixel.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdatePixelsWDto extends PartialType(UpdatePixelDto) {
  @IsNotEmpty()
  colorId: string;

  // Pixel id
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
