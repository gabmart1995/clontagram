import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from 'src/comments/comments.service';
import { Comments, Images, Likes, Users } from 'src/entities';
import { ImageService } from 'src/image/image.service';
import { LikeService } from 'src/like/like.service';
import { LoggedMiddleware } from 'src/middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// import { CONFIG_STORAGE_USERS } from 'src/config/storage.config';


@Module({
    imports: [
        TypeOrmModule.forFeature([ Users, Images, Comments, Likes ]),
        MulterModule.register()
    ],
    controllers: [UserController],
    providers: [UserService, ImageService, CommentsService, LikeService]
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggedMiddleware)
            .forRoutes(UserController)
    }
}
