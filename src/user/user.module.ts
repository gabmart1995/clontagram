import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities';
import { LoggedMiddleware } from 'src/middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Users ])
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggedMiddleware)
            .forRoutes(UserController)
    }
}
