import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import express from 'express';

async function bootstrap() {
  
  // indicate a express app
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // configure the views
  app.useStaticAssets( join( __dirname, '..', 'public' ) );
  
  // configure engine template ejs
  // app.set('view engine', 'ejs');
  app.setViewEngine('ejs');
  app.set('views', 'public');

  // ready server
  await app.listen(3000);
}

bootstrap();
