import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { PixelService } from 'src/pixel/pixel.service';
import { CanvasConfigService } from 'src/canvas-config/canvas-config.service';
import { ColorService } from 'src/color/color.service';

import { SeedExecuteDto } from './dto/seed-execute.dto';
import { initialData } from './data/seed-data';
import { Color } from 'src/color/entities/color.entity';

@Injectable()
export class SeedService {
  private tokenRunSeed = process.env.TOKEN_RUN_SEED;
  private initialColor = '#ffffff';

  constructor(
    private readonly canvasConfigService: CanvasConfigService,
    private readonly colorService: ColorService,
    private readonly pixelService: PixelService,
  ) {}

  async runSeed(seedExecuteDto: SeedExecuteDto) {
    if (seedExecuteDto.token !== this.tokenRunSeed)
      throw new UnauthorizedException('Token is not valid');

    // Delete all tables
    await this.deleteTables();

    // Create tables
    await this.createCanvasConfig();
    await this.createColors();

    const initialColor: Color = await this.colorService.findOne('blanco');
    if (!initialColor)
      throw new InternalServerErrorException('Something unexpected happend.');

    await this.createPixel(initialColor);

    return 'SEED EXECUTED';
  }

  async createCanvasConfig() {
    try {
      initialData.canvasConfigs.map((canvasConfig) => {
        this.canvasConfigService.create(canvasConfig);
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createColors() {
    try {
      await Promise.all(
        initialData.colors.map(async (color) => {
          await this.colorService.create(color);
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createPixel(initialColor: Color) {
    try {
      await this.pixelService.createPixelBlank(
        initialData.pixelQuadrantSize,
        initialColor,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // THIS IS A DESTRUCTIVE ACTION (DB)
  // - canvas_config , devices
  // - colors
  // - pixel
  async deleteTables() {
    await this.canvasConfigService.deleteAll();
    await this.pixelService.deleteAll(); // first pixelService to avoid constraints problems
    await this.colorService.deleteAll();
  }
}
