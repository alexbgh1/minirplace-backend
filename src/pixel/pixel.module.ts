import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PixelController } from './pixel.controller';
import { PixelService } from './pixel.service';

import { Pixel } from './entities/pixel.entity';
import { PixelStat } from './entities/stat.entity';
import { ColorModule } from 'src/color/color.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pixel, PixelStat]), ColorModule],
  controllers: [PixelController],
  providers: [PixelService],
  exports: [PixelService, TypeOrmModule],
})
export class PixelModule {}
