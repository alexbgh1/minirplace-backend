import { Module } from '@nestjs/common';

import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

import { PixelModule } from 'src/pixel/pixel.module';
import { CanvasConfigModule } from 'src/canvas-config/canvas-config.module';
import { ColorModule } from 'src/color/color.module';

@Module({
  imports: [PixelModule, CanvasConfigModule, ColorModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
