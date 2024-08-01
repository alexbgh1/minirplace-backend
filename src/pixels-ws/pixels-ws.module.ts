import { Module } from '@nestjs/common';

import { PixelsWsGateway } from './pixels-ws.gateway';

import { PixelsWsService } from './pixels-ws.service';

import { PixelModule } from 'src/pixel/pixel.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PixelModule, UsersModule, AuthModule],
  providers: [PixelsWsGateway, PixelsWsService],
})
export class PixelsWsModule {}
