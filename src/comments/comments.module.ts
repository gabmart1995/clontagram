import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments, Images, Users } from 'src/entities';
import { ImageService } from 'src/image/image.service';
import { LoggedMiddleware } from 'src/middleware';
import { UserService } from 'src/user/user.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Comments ])
  ],
  controllers: [
    CommentsController,
  ],
  providers: [CommentsService],
})
export class CommentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggedMiddleware)
      .forRoutes(CommentsController)
  }
}
