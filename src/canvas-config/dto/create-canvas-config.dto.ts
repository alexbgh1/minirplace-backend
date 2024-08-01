import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CreateDeviceDto } from './create-device.dto';

export class CreateCanvasConfigDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => CreateDeviceDto)
  @IsNotEmpty({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  devices: CreateDeviceDto[];
}
