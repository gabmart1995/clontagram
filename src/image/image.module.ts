import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggedMiddleware } from 'src/middleware';
import { ImageController } from './image.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images, Users } from 'src/entities';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [ImageController],
  imports: [ 
    TypeOrmModule.forFeature([ Images, Users ]),
    MulterModule.register(),
  ],
  providers: [
    ImageService,
    UserService
  ]
})
export class ImageModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
      consumer
          .apply(LoggedMiddleware)
          .forRoutes(ImageController)
  }
}
