import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(
    // Allow these origins to access the API
    {
      origin: ['http://localhost:5173', 'http://localhost:8080'],
      // Allow these headers to be sent
      allowedHeaders: ['Content-Type', 'Authorization'],
      // Allow these methods to be used
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
  );

  // All routes will be prefixed with /api
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      // Strip (remove) away any properties that don't have any decorators
      whitelist: true,
      // Throw an error if any non-decorated properties are present
      // ex: @IsString() name: string => { name: 'John' } is valid, { name: 'John', age: 25 } is stripped to { name: 'John' }
      forbidNonWhitelisted: true,
      // Transform the incoming data to match the DTO's properties
      transform: true,
      transformOptions: {
        // Convert query params and route params to their specified types
        // ex: '1' => 1, 'true' => true, 'null' => null
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${process.env.PORT}`);
}
bootstrap();
