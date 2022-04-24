import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggedMiddleware } from 'src/middleware';
import { ImageController } from './image.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from 'src/entities';


@Module({
  controllers: [ImageController],
  imports: [ 
    TypeOrmModule.forFeature([ Images ]),
    MulterModule.register(),
  ],
  providers: [ImageService],
})
export class ImageModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
      consumer
          .apply(LoggedMiddleware)
          .forRoutes(ImageController)
  }
}
