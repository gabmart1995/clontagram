import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from 'src/comments/comments.service';
import { Comments, Images, Likes, Users } from 'src/entities';
import { ImageModule } from 'src/image/image.module';
import { ImageService } from 'src/image/image.service';
import { LoggedMiddleware } from 'src/middleware';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Likes ]),
    ],
    controllers: [LikeController],
    providers: [LikeService],
})
export class LikeModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggedMiddleware)
            .forRoutes( LikeController );
    }
}
