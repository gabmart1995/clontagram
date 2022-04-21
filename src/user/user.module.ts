import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from 'src/comments/comments.service';
import { Comments, Images, Users } from 'src/entities';
import { ImageService } from 'src/image/image.service';
import { LoggedMiddleware } from 'src/middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// import { CONFIG_STORAGE_USERS } from 'src/config/storage.config';


@Module({
    imports: [
        TypeOrmModule.forFeature([ Users, Images, Comments ]),
        MulterModule.register()
    ],
    controllers: [UserController],
    providers: [UserService, ImageService, CommentsService]
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggedMiddleware)
            .forRoutes(UserController)
    }
}
