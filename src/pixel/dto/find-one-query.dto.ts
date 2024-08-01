import { IsBoolean, IsOptional } from 'class-validator';

export class FindOneQueryDto {
  @IsOptional()
  @IsBoolean()
  user?: boolean;
}
