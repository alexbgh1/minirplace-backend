import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ColorController } from './color.controller';
import { ColorService } from './color.service';

import { Color } from './entities/color.entity';
import { UserColorStats } from 'src/users/entities/userColorStats.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Color, UserColorStats, User])],
  controllers: [ColorController],
  providers: [ColorService],
  exports: [ColorService, TypeOrmModule],
})
export class ColorModule {}
