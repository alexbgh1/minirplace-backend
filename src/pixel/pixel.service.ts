import {
  BadRequestException,
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { UpdatePixelDto } from './dto/update-pixel.dto';

import { Pixel } from './entities/pixel.entity';
import { PixelStat } from './entities/stat.entity';
import { Color } from 'src/color/entities/color.entity';

import { validate as isUUID } from 'uuid';
import { ColorService } from 'src/color/color.service';
import { User } from 'src/users/entities/user.entity';
import { FindOneQueryDto } from './dto/find-one-query.dto';

@Injectable()
export class PixelService {
  private readonly CACHE_PREFIX = 'pixel:';

  constructor(
    private colorService: ColorService,

    @InjectRepository(Pixel)
    private pixelRepository: Repository<Pixel>,

    @InjectRepository(PixelStat)
    private pixelStatRepository: Repository<PixelStat>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createPixelBlank(numberQuadrants: number, initialColor: Color) {
    // This will insert the number of 'giant' pixels
    // ex: numberQuadrants: 20 -> 20x20 registries

    const allPixelPromises: Promise<Pixel>[] = [];
    try {
      for (let row = 0; row < numberQuadrants; row++) {
        for (let column = 0; column < numberQuadrants; column++) {
          const pixelStats = await this.createPixelStat();

          const pixel = this.pixelRepository.create({
            xQuadrant: row,
            yQuadrant: column,
            color: initialColor,
            stats: pixelStats,
          });

          allPixelPromises.push(this.pixelRepository.save(pixel));
        }
      }
      Promise.all(allPixelPromises);
    } catch (error) {
      this.handleDBException(error);
    }

    return '';
  }

  async deleteAll() {
    try {
      // delete all pixels and pixelStats
      await this.pixelRepository.delete({});
      await this.pixelStatRepository.delete({});
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async createPixelStat() {
    try {
      const pixelStat = this.pixelStatRepository.create();
      return await this.pixelStatRepository.save(pixelStat);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll() {
    const cacheKey = `${this.CACHE_PREFIX}all`;
    const cachedPixels = await this.cacheManager.get(cacheKey);
    if (cachedPixels) return cachedPixels;

    const pixels = await this.pixelRepository.find();
    await this.cacheManager.set(cacheKey, pixels, 3000);
    return pixels;
  }

  async findOneByQuadrant(
    xQuadrant: string,
    yQuadrant: string,
    user?: FindOneQueryDto,
  ) {
    // check if number
    if (isNaN(+xQuadrant) || isNaN(+yQuadrant)) {
      throw new BadRequestException('Invalid Pixel Quadrant');
    }

    const cacheKey = `${this.CACHE_PREFIX}${xQuadrant}-${yQuadrant}${user ? '-user' : ''}`;
    const cachedPixel = await this.cacheManager.get(cacheKey);
    if (cachedPixel) return cachedPixel;

    let pixel: Pixel;
    if (user) {
      pixel = await this.pixelRepository.findOne({
        where: { xQuadrant: +xQuadrant, yQuadrant: +yQuadrant },
        relations: ['user', 'stats'],
      });
      if (pixel.user) {
        delete pixel.user.last_login;
        delete pixel.user.created_at;
      }
    } else {
      pixel = await this.pixelRepository.findOne({
        where: { xQuadrant: +xQuadrant, yQuadrant: +yQuadrant },
      });
    }

    if (!pixel) throw new BadRequestException('Pixel not found in quadrant');
    await this.cacheManager.set(cacheKey, pixel, 1000);
    return pixel;
  }

  async findOne(id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid Pixel UUID');
    const pixel = await this.pixelRepository.findOne({ where: { id } });
    if (!pixel) throw new BadRequestException('Pixel not found');
    return pixel;
  }

  async findOneWPixelStats(id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    const pixel = await this.pixelRepository.findOne({
      where: { id },
      relations: ['stats'],
    });
    if (!pixel) throw new BadRequestException('Pixel not found');
    return pixel;
  }

  async update(id: string, user: User, updatePixelDto: UpdatePixelDto) {
    const pixel = await this.findOneWPixelStats(id);
    const color = await this.colorService.findOne(updatePixelDto.colorId);

    // Update Pixel relation & stats
    await this.assignNewValues(pixel, color, user);
    await this.updatePixelStat(pixel);

    // Update User relation & stats (color)
    await this.colorService.updateUserStatsColor(user, color);

    return this.savePixel(pixel);
  }

  private async updatePixelStat(pixel: Pixel) {
    if (pixel.stats) {
      pixel.stats.count++;
      await this.pixelStatRepository.save(pixel.stats);
    } else {
      const newPixelStat = this.pixelStatRepository.create();
      pixel.stats = await this.pixelStatRepository.save(newPixelStat);
    }
  }

  private async assignNewValues(pixel: Pixel, color: Color, user: User) {
    pixel.color = color;
    pixel.user = user;
    // timestamptz
    pixel.updatedAt = new Date();
  }

  private async savePixel(pixel: Pixel): Promise<Pixel> {
    try {
      return await this.pixelRepository.save(pixel);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} pixel`;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException(
      'Unexpected error. Please try again later.',
    );
  }
}
