import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { JwtModule } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { Pixel } from 'src/pixel/entities/pixel.entity';
import { UserColorStats } from './entities/userColorStats.entity';
import { Color } from 'src/color/entities/color.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserColorStats, Color, Pixel]),
    JwtModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
