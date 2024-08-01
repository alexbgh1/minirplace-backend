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

import { Color } from './entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';

import { User } from 'src/users/entities/user.entity';
import { UserColorStats } from 'src/users/entities/userColorStats.entity';
import { UserColorStatDto } from './dto/user-color-stat.dto';

@Injectable()
export class ColorService {
  private readonly CACHE_PREFIX_COLOR = 'color:';
  constructor(
    @InjectRepository(UserColorStats)
    private readonly userColorStatsRepository: Repository<UserColorStats>,

    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll(): Promise<Color[]> {
    let colors: Color[] = await this.cacheManager.get<Color[]>(
      `${this.CACHE_PREFIX_COLOR}all`,
    );

    try {
      if (colors) {
        return colors;
      }

      colors = await this.colorRepository.find({});
      await this.cacheManager.set(
        `${this.CACHE_PREFIX_COLOR}all`,
        colors,
        86400, // 1 day
      );
      return colors;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(term: string): Promise<Color> {
    let color: Color;

    color = await this.cacheManager.get<Color>(
      `${this.CACHE_PREFIX_COLOR}${term}`,
    );

    try {
      if (!isNaN(+term)) {
        color = await this.colorRepository.findOneBy({ id: +term });
      }

      if (!color) {
        color = await this.colorRepository.findOneBy({ name: term });
      }
    } catch (error) {
      this.handleDBException(error);
    }

    if (!color) {
      throw new NotFoundException(`Color with term '${term}' not found`);
    }

    await this.cacheManager.set(
      `${this.CACHE_PREFIX_COLOR}${color.id}`,
      color,
      86400, // 1 day
    );

    return color;
  }

  async create(createColorDto: CreateColorDto) {
    try {
      const color = this.colorRepository.create(createColorDto);
      return await this.colorRepository.save(color);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async updateUserStatsColor(user: User, color: Color) {
    let userStatsColor = await this.findColorStats(user, color);
    if (userStatsColor) {
      userStatsColor.count++;
    } else {
      userStatsColor = this.userColorStatsRepository.create({
        user: user,
        color: color,
        count: 1,
      });
    }

    await this.userColorStatsRepository.save(userStatsColor);
  }

  async findColorStats(user: User, color: Color): Promise<UserColorStats> {
    const userStatsColor = await this.userColorStatsRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        color: {
          id: color.id,
        },
      },
      relations: ['user', 'color'],
    });

    return userStatsColor;
  }

  async findMostColoredPixelsByUser(user: User): Promise<UserColorStatDto[]> {
    // Return colors with most count
    try {
      // user 1<->n user_colors_stats n<->1 color
      const mostUsedColorsByUser = await this.colorRepository
        .createQueryBuilder('color')
        .leftJoinAndSelect('color.userColorStats', 'userColorStats')
        .leftJoin('userColorStats.user', 'user')
        .where('user.id = :userId', { userId: user.id })
        .orderBy('userColorStats.count', 'DESC')
        .getMany();

      // Convert to plain Color[] + {count: number}
      const mostUsedColorsByUserDto: UserColorStatDto[] =
        mostUsedColorsByUser.map((color) => {
          const { userColorStats, ...colorWithoutStats } = color;
          return {
            ...colorWithoutStats,
            count: Number(userColorStats[0].count),
          };
        });

      return mostUsedColorsByUserDto;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async deleteAllColorStats() {
    try {
      return await this.userColorStatsRepository.delete({});
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async deleteAll() {
    try {
      this.deleteAllColorStats();
      return await this.colorRepository.delete({});
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
