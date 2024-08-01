import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CanvasConfigService } from './canvas-config.service';
import { CreateCanvasConfigDto } from './dto/create-canvas-config.dto';

@Controller('canvas-config')
export class CanvasConfigController {
  constructor(private readonly canvasConfigService: CanvasConfigService) {}

  @Post()
  async create(@Body() createCanvasConfigDto: CreateCanvasConfigDto) {
    return this.canvasConfigService.create(createCanvasConfigDto);
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    return this.canvasConfigService.findOne(name);
  }
}
