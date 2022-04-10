import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as csurf from 'csurf';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  
  // indicate a express app
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const csrfMiddleware = csurf({ cookie: true });

  // configure the views
  app.useStaticAssets( join( __dirname, '..', 'public' ) );
  
  // configure engine template ejs
  app.set('view engine', 'ejs');
  app.set('views', 'public');

  // set forms, session, middlewares, cookies and csrf protection
  // important: parse forms y cookie parser before send csrfmiddleware 
  app
    .use( bodyParser.urlencoded({ extended: false }) )
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
    .use( cookieParser() )
    .use( csrfMiddleware );
    
  // ready server
  await app.listen(3000);
}

bootstrap();
