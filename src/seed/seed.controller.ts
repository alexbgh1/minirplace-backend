import { UseGuards, Body, Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedExecuteDto } from './dto/seed-execute.dto';
import { SeedAuthGuard } from './seed-auth.guard';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @UseGuards(SeedAuthGuard)
  executeSeed(@Body() seedExecuteDto: SeedExecuteDto) {
    return this.seedService.runSeed(seedExecuteDto);
  }
}
