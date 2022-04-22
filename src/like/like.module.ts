import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images, Likes, Users } from 'src/entities';
import { LoggedMiddleware } from 'src/middleware';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Likes, Users, Images ])
    ],
    controllers: [LikeController],
    providers: [LikeService]
})
export class LikeModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggedMiddleware)
            .forRoutes( LikeController );
    }
}
