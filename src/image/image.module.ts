import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggedMiddleware } from 'src/middleware';
import { ImageController } from './image.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments, Images, Likes, Users } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { CommentsService } from 'src/comments/comments.service';
import { LikeService } from 'src/like/like.service';

@Module({
  controllers: [ImageController],
  imports: [ 
    TypeOrmModule.forFeature([ Images, Comments, Likes, Users ]),
    MulterModule.register(),
  ],
  providers: [
    ImageService,
    UserService,
    LikeService,
    CommentsService
  ],
})
export class ImageModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
      consumer
          .apply(LoggedMiddleware)
          .forRoutes(ImageController)
  }
}
