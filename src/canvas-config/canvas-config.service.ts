import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { CreateCanvasConfigDto } from './dto/create-canvas-config.dto';
import { CanvasConfig } from './entities/canvas-config.entity';
import { Device } from './entities/device.entity';

@Injectable()
export class CanvasConfigService {
  private readonly CACHE_PREFIX = 'canvas-config';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    @InjectRepository(CanvasConfig)
    private readonly canvasConfigRepository: Repository<CanvasConfig>,
  ) {}
  async create(createCanvasConfigDto: CreateCanvasConfigDto) {
    try {
      const canvasConfig = new CanvasConfig();
      canvasConfig.name = createCanvasConfigDto.name;
      canvasConfig.devices = createCanvasConfigDto.devices.map((deviceDto) => {
        const device = new Device();
        device.name = deviceDto.name;
        device.width = deviceDto.width;
        device.height = deviceDto.height;
        device.pixelSize = deviceDto.pixelSize;
        return device;
      });

      this.canvasConfigRepository.create(canvasConfig);
      await this.canvasConfigRepository.save(canvasConfig);
      return { canvasConfig };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(name: string) {
    const cacheKey = `${this.CACHE_PREFIX}:${name}`;
    const canvasConfigCached = await this.cacheManager.get(cacheKey);
    if (canvasConfigCached) return canvasConfigCached;

    let canvasConfig: CanvasConfig;
    try {
      canvasConfig = await this.canvasConfigRepository.findOneBy({
        name: name,
      });
    } catch (error) {
      this.handleDBException(error);
    }
    if (!canvasConfig) throw new NotFoundException();

    this.cacheManager.set(cacheKey, canvasConfig, 1000 * 10);
    return canvasConfig;
  }

  async deleteAll() {
    try {
      return await this.canvasConfigRepository.delete({});
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException(
      'Unexpected error. Please try again later.',
    );
  }
}
