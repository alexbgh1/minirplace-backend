import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';
import { PixelService } from './pixel.service';
import { UpdatePixelDto } from './dto/update-pixel.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FindOneQueryDto } from './dto/find-one-query.dto';

@Controller('pixel')
export class PixelController {
  constructor(private readonly pixelService: PixelService) {}

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updatePixelDto: UpdatePixelDto,
  ) {
    return this.pixelService.update(id, user, updatePixelDto);
  }

  // send as /xQuadrant/yQuadrant
  @Get(':xQuadrant/:yQuadrant')
  findOneByQuadrant(
    @Param('xQuadrant') xQuadrant: string,
    @Param('yQuadrant') yQuadrant: string,
    @Query('user') user?: FindOneQueryDto,
  ) {
    return this.pixelService.findOneByQuadrant(xQuadrant, yQuadrant, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pixelService.findOne(id);
  }

  @Get()
  findAll() {
    return this.pixelService.findAll();
  }
}
