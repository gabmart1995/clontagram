// modules es7
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as csurf from 'csurf';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { INestApplication } from '@nestjs/common';

import * as dotenv from 'dotenv';
dotenv.config();

// modules es5 import using require
// import return undefined
const flash = require('connect-flash');

// export app info 
let app: INestApplication & NestExpressApplication;

async function bootstrap() {
  
  // indicate a express app
  // configure the views, static assets and engine 
  app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets( join( __dirname, '..', 'public', 'static' ) );
  app.setBaseViewsDir( join( __dirname, '..', 'public' ) )
  app.setViewEngine('ejs')
  
  // set forms, session, middlewares, cookies and csrf protection
  // important: parse forms y cookie parser before send csrfmiddleware 
  app
    .use( cors({ origin: process.env.APP_NAME, methods: 'GET' }) )
    .use( bodyParser.urlencoded({ extended: true }) )
    .use( 
      session({
        name: 'nest session',
        secret: 'API_SECRET_KEY',
        saveUninitialized: false,
        resave: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 // one day
        }
      })
    )
    .use( flash() )
    .use( cookieParser() )
    .use( csurf({ cookie: true }) );
  
  // ready server
  await app.listen(process.env.PORT, () => {
    console.log('Server running in the port: ' + process.env.PORT);
  });
}

bootstrap();

export { app }; 