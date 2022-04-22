import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Comments, Images, Likes, Users } from './entities';
import { NoLoggedMiddleware } from './middleware';
import { UserModule } from './user/user.module';
import { ImageModule } from './image/image.module';
import { CommentsModule } from './comments/comments.module';
import { LikeModule } from './like/like.module';
import { LikeService } from './like/like.service';
import { LikeController } from './like/like.controller';

@Module({
  imports: [ 
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    TypeOrmModule.forFeature([ Users, Images, Likes, Comments ]),
    UserModule,
    ImageModule,
    CommentsModule,
    LikeModule,
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
