import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { ConfigModule } from '@nestjs/config';

import { CanvasConfigModule } from './canvas-config/canvas-config.module';
import { UsersModule } from './users/users.module';
import { ColorModule } from './color/color.module';
import { PixelModule } from './pixel/pixel.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';

import { PixelsWsModule } from './pixels-ws/pixels-ws.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, // Don't use this in production
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    SeedModule,
    CanvasConfigModule,
    PixelModule,
    AuthModule,
    UsersModule,
    ColorModule,
    PixelsWsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
