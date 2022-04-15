import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities';
import { LoggedMiddleware } from 'src/middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CONFIG_STORAGE_USERS } from 'src/config/storage.config';


@Module({
    imports: [
        TypeOrmModule.forFeature([ Users ]),
        MulterModule.register( CONFIG_STORAGE_USERS )
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
