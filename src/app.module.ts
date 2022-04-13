import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities';
import { NoLoggedMiddleware } from './middleware';
import { UserModule } from './user/user.module';
import * as multer from 'multer';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';

const storage = multer.diskStorage({
    
  destination: ( request, file, callback ) => {
      callback( null, join( process.cwd(), 'public', 'uploads' ) );
  },
  
  filename: ( request, file, callback ) => {

      let name = file.fieldname + '-' + Date.now();

      switch ( file.mimetype ) {
          
          case 'image/png':
              name += '.png';
              break;

          case 'image/jpeg':
              name += '.jpeg';
              break;

          default:
              name += '.jpg';
              break;
      }

      callback( null, name );
  },
});


@Module({
  imports: [ 
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    TypeOrmModule.forFeature([ Users ]),
    UserModule,
    MulterModule.register({ 
      storage, 
      limits: { fileSize: 1e6 } 
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure( consumer: MiddlewareConsumer ) {
    
    // register middlewares
    consumer
      .apply(NoLoggedMiddleware)  
      .forRoutes(
        { path: '/', method: RequestMethod.GET },
        { path: '/register', method: RequestMethod.GET }
      )
  }
}
