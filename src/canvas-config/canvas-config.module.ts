import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CanvasConfigController } from './canvas-config.controller';
import { CanvasConfigService } from './canvas-config.service';

import { CanvasConfig } from './entities/canvas-config.entity';
import { Device } from './entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CanvasConfig, Device])],
  controllers: [CanvasConfigController],
  providers: [CanvasConfigService],
  exports: [CanvasConfigService, TypeOrmModule],
})
export class CanvasConfigModule {}
