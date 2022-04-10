import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images, Users } from './entities';
import { join } from 'path';


@Module({
  imports: [ 
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    // TypeOrmModule.forFeature([ Users, Images ]),
    // server static configuration
    ServeStaticModule.forRoot({
      renderPath: (/^\w+\.ejs$/),  // path of render of views 
      rootPath: join( __dirname, '..', 'public' ),
      serveStaticOptions: {
        extensions: ['html'] // extensions fallback if not found .ejs
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
