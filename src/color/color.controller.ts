import { Controller, Get, Param } from '@nestjs/common';
import { ColorService } from './color.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorsService: ColorService) {}

  @Get()
  findAll() {
    return this.colorsService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.colorsService.findOne(term);
  }

  @Auth()
  @Get('pixel-stats/most-colored-pixels')
  findMostColoredPixels(@GetUser() user: User) {
    return this.colorsService.findMostColoredPixelsByUser(user);
  }
}
